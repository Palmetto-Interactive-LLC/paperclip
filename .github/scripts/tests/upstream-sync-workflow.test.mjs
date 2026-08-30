import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(new URL("../../workflows/upstream-sync.yml", import.meta.url), "utf8");
const script = await readFile(new URL("../upstream-sync.mjs", import.meta.url), "utf8");

test("upstream sync has a scheduled and manual trigger", () => {
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /workflow_dispatch:/);
});

test("upstream sync grants only branch and PR write permissions", () => {
  assert.match(workflow, /permissions:\n  contents: write\n  pull-requests: write/);
  assert.doesNotMatch(workflow, /id-token:\s*write/);
  assert.doesNotMatch(workflow, /actions:\s*write/);
});

test("workflow actions are pinned to an immutable commit", () => {
  const uses = [...workflow.matchAll(/uses:\s*([^\s#]+)/g)].map((match) => match[1]);
  assert.deepEqual(uses, ["actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1"]);
});

test("workflow checks out master and executes the reviewed script", () => {
  assert.match(workflow, /ref: master/);
  assert.match(workflow, /node \.github\/scripts\/upstream-sync\.mjs/);
  assert.match(workflow, /github\.event_name == 'schedule' \|\| github\.ref == 'refs\/heads\/master'/);
});

test("sync script uses a three-way merge and fails closed on conflicts", () => {
  assert.match(script, /git\(\["merge", "--no-edit", "--no-ff", upstreamSha\]\)/);
  assert.match(script, /git\(\["merge", "--abort"\], \{ allowFailure: true \}\)/);
  assert.match(script, /no branch or PR was pushed/);
  assert.match(script, /git\(\["push", "origin", `HEAD:refs\/heads\/\$\{branch\}`\]\)/);
  assert.doesNotMatch(script, /--force(?:-with-lease)?/);
});

test("sync script never pushes master and protects fork-owned paths", () => {
  assert.doesNotMatch(script, /HEAD:refs\/heads\/master/);
  for (const path of [
    "Dockerfile",
    ".github/workflows/docker.yml",
    "docker/server-deps/",
    "packages/teams-catalog/catalog/optional/incident-response/palmetto-incident-first/",
    "server/src/__tests__/cloud-image-sentry.test.ts",
  ]) {
    assert.match(script, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("PR body requires the existing ci / verify gate", () => {
  assert.match(script, /ci ` \/ verify|ci \/ verify/);
});
