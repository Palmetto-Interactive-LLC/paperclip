import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Drift guard for the application images' bundled Sentry server package
 * (Dockerfile `production` and `cloud` targets).
 *
 * Both image targets get server error reports with no separate install step.
 * The dependency stage reads the version from the `peerDependencies` block
 * of `server/package.json` at build time, so the version has one committed
 * home. This test pins that relationship and ensures the browser's separate
 * exact pin remains in `ui/package.json`.
 */

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const dockerfile = readFileSync(path.join(repoRoot, "Dockerfile"), "utf8");
const workflow = readFileSync(path.join(repoRoot, ".github", "workflows", "docker.yml"), "utf8");
const serverPackageJson = JSON.parse(
  readFileSync(path.join(repoRoot, "server", "package.json"), "utf8"),
) as { peerDependencies?: Record<string, string> };
const uiPackageJson = JSON.parse(
  readFileSync(path.join(repoRoot, "ui", "package.json"), "utf8"),
) as { devDependencies?: Record<string, string> };

const declaredVersion = serverPackageJson.peerDependencies?.["@sentry/node"];

const probeSource = readFileSync(
  path.join(repoRoot, "scripts", "assert-cloud-image-sentry.mjs"),
  "utf8",
);

/**
 * Build a throwaway directory that stands in for the image's `/app/server`
 * directory: a copy of the probe script (module resolution walks from a
 * script's own location, so the copy must sit where the fake `server`
 * directory expects it), a minimal but real `@sentry/node` package, and,
 * when `withTsxLoader` is true, a symbolic link at `node_modules/tsx` that
 * mirrors the real workspace install (a link out to a separate store
 * directory holding `dist/loader.mjs`). Omitting the link stands in for the
 * Sentry copy removing or shadowing it.
 */
function buildFakeServerDir(withTsxLoader: boolean) {
  const root = mkdtempSync(path.join(tmpdir(), "cloud-image-sentry-probe-"));
  const serverDir = path.join(root, "server");
  const sentryDir = path.join(serverDir, "node_modules", "@sentry", "node");
  mkdirSync(sentryDir, { recursive: true });
  writeFileSync(
    path.join(sentryDir, "package.json"),
    JSON.stringify({ name: "@sentry/node", version: "9.9.9", type: "module", main: "index.mjs" }),
  );
  writeFileSync(path.join(sentryDir, "index.mjs"), "export {};\n");

  if (withTsxLoader) {
    const tsxStoreDist = path.join(root, "tsx-store", "dist");
    mkdirSync(tsxStoreDist, { recursive: true });
    writeFileSync(path.join(tsxStoreDist, "loader.mjs"), "export {};\n");
    symlinkSync(path.join("..", "..", "tsx-store"), path.join(serverDir, "node_modules", "tsx"));
  }

  const probeCopy = path.join(serverDir, "probe.mjs");
  writeFileSync(probeCopy, probeSource);
  return { root, probeCopy };
}

function runProbe(probeCopy: string) {
  return spawnSync(process.execPath, [probeCopy], { encoding: "utf8" });
}

describe("cloud image Sentry install", () => {
  it("declares @sentry/node as an optional peer in server/package.json", () => {
    expect(
      declaredVersion,
      "server/package.json must declare @sentry/node as an optional peer",
    ).toBeTruthy();
  });

  it("keeps the browser SDK pinned to the same exact version", () => {
    expect(uiPackageJson.devDependencies?.["@sentry/browser"]).toBe("10.71.0");
    expect(declaredVersion).toBe("10.71.0");
  });

  it("installs @sentry/node before production and copies it into the image", () => {
    const stageHeaderPattern = /^FROM\s+\S+\s+AS\s+(\S+)/gim;
    const stages = [...dockerfile.matchAll(stageHeaderPattern)].map((match) => ({
      name: match[1],
      index: match.index ?? 0,
    }));

    const productionIndex = stages.findIndex((stage) => stage.name.toLowerCase() === "production");
    expect(productionIndex, "the Dockerfile must declare a production stage").toBeGreaterThanOrEqual(0);

    const productionStage = stages[productionIndex];
    const serverDepsStage = stages.find((stage) => stage.name.toLowerCase() === "server-deps");
    expect(serverDepsStage, "the Dockerfile must declare a server-deps stage").toBeTruthy();
    expect(serverDepsStage!.index).toBeLessThan(productionStage.index);
    expect(dockerfile).toMatch(
      /FROM\s+build\s+AS\s+server-deps[\s\S]*?@sentry\/node@\$\{version\}[\s\S]*?FROM\s+base\s+AS\s+production/,
    );
    expect(dockerfile).toMatch(
      /--from=server-deps\s+\/app\/\.server-deps\/node_modules\s+\/app\/server\/node_modules/,
    );
  });

  it("copies the installed package into the production server node_modules", () => {
    expect(dockerfile).toMatch(
      /^COPY --chown=node:node --from=[\w-]+ \S+ \S*server\/node_modules$/m,
    );
  });

  it("reads the installed version from server/package.json instead of a second hardcoded copy", () => {
    // Matches a literal pin such as "@sentry/node@10.71.0", not a shell
    // variable interpolation such as "@sentry/node@${version}".
    const versionPinPattern = /@sentry\/node@(\d[^\s"'`]*)/g;

    for (const source of [
      { label: "Dockerfile", text: dockerfile },
      { label: "docker workflow", text: workflow },
    ]) {
      for (const match of source.text.matchAll(versionPinPattern)) {
        expect(
          match[1],
          `${source.label} pins @sentry/node@${match[1]}, which must equal the declared ` +
            `optional peer version ${declaredVersion}`,
        ).toBe(declaredVersion);
      }
    }
  });

  it("declares no committed manifest that re-states the version", () => {
    expect(
      existsSync(path.join(repoRoot, "docker", "cloud-server-deps")),
      "docker/cloud-server-deps must not exist; the version has one home, " +
        "server/package.json's peerDependencies block",
    ).toBe(false);
  });
});

describe("cloud image Sentry probe: the server's tsx loader", () => {
  it("exits non-zero and names the loader path when server/node_modules/tsx does not resolve", () => {
    const { root, probeCopy } = buildFakeServerDir(false);
    try {
      const result = runProbe(probeCopy);
      expect(result.status, "the probe must fail loudly, not boot a broken image").not.toBe(0);
      expect(
        result.stderr,
        "the error must name the exact path the production CMD boots through",
      ).toContain(path.join("node_modules", "tsx", "dist", "loader.mjs"));
      expect(result.stdout, "a failed probe must not print a version string").toBe("");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("still prints only the installed @sentry/node version when the loader resolves", () => {
    const { root, probeCopy } = buildFakeServerDir(true);
    try {
      const result = runProbe(probeCopy);
      expect(result.status).toBe(0);
      expect(result.stdout).toBe("9.9.9");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
