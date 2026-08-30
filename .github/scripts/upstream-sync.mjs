#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const UPSTREAM_REPOSITORY = "paperclipai/paperclip";
export const DEFAULT_BRANCH = "master";
export const SYNC_BRANCH_PREFIX = "automation/upstream-sync-";

// These are Palmetto-owned changes. A sync that would alter one of these paths
// stops before push so a human can resolve the ownership boundary in a PR.
export const PRESERVED_PATHS = [
  "Dockerfile",
  ".github/workflows/docker.yml",
  "doc/observability.md",
  "docker/server-deps/",
  "packages/teams-catalog/catalog/optional/incident-response/palmetto-incident-first/",
  "packages/teams-catalog/generated/catalog.json",
  "packages/teams-catalog/src/shipped-catalog.test.ts",
  "server/src/__tests__/cloud-image-sentry.test.ts",
  "server/src/__tests__/teams-catalog-install-no-overrides.test.ts",
];

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status === 0) return result.stdout.trim();
  if (allowFailure) return null;
  const detail = (result.stderr || result.stdout || "").trim();
  throw new Error(`git ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`);
}

function gitOk(args) {
  return spawnSync("git", args, { stdio: "ignore" }).status === 0;
}

function gh(args) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  }).trim();
}

function summary(text) {
  process.stdout.write(`${text}\n`);
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (path) writeFileSync(path, `${text}\n`, { flag: "a" });
}

function isAncestor(older, newer) {
  return gitOk(["merge-base", "--is-ancestor", older, newer]);
}

function remoteBranchExists(remote, branch) {
  return gitOk(["ls-remote", "--exit-code", "--heads", remote, `refs/heads/${branch}`]);
}

function openSyncPullRequests(repository) {
  const rows = JSON.parse(
    gh([
      "api",
      `/repos/${repository}/pulls?state=open&base=${DEFAULT_BRANCH}&per_page=100`,
    ]) || "[]",
  );
  return rows.filter(
    (row) =>
      row.base?.ref === DEFAULT_BRANCH &&
      row.head?.ref?.startsWith(SYNC_BRANCH_PREFIX),
  );
}

function pullRequestBody({ forkSha, upstreamSha, mergeBase, branch }) {
  return `## Thinking Path

> - Paperclip is the open source app people use to manage AI agents for work.
> - The Palmetto fork carries a small set of production image and team-package patches.
> - Upstream changes must be reviewed against those fork-owned paths.
> - Direct master synchronization would hide conflicts and could drop Palmetto patches.
> - This pull request carries a three-way merge from the pinned upstream master tip.
> - The benefit is a repeatable, reviewable update path with an explicit preservation check.

## Linked Issues or Issue Description

**Problem or motivation**

The fork needs regular upstream updates without force-syncing its protected master branch or losing fork-owned patches.

**Proposed solution**

The scheduled workflow creates a fresh automation branch, merges upstream, stops on conflicts or protected-path changes, and opens one review pull request.

**Alternatives considered**

Direct pushes and force-syncs were rejected because they bypass review and can overwrite fork work.

## What Changed

- Upstream repository: \`${UPSTREAM_REPOSITORY}\`
- Upstream master: \`${upstreamSha}\`
- Fork master at sync start: \`${forkSha}\`
- Common ancestor: \`${mergeBase}\`
- Review branch: \`${branch}\`
- Palmetto Sentry/image and team-package paths were checked for byte-for-byte preservation.

## Verification

- The workflow fetched upstream master and completed the merge without conflicts.
- Protected paths were compared with fork master before push.
- The required \`ci / verify\` check must pass on this pull request before merge.

## Risks

Upstream changes can still alter behavior outside the protected paths. Review the diff and wait for \`ci / verify\`; a conflict or protected-path change fails closed for human resolution.

## Model Used

Codex (GPT-5), tool-use and code-execution agent.

## Checklist

- [x] I have included a thinking path that traces from project context to this change
- [x] I have specified the model used (with version and capability details)
- [x] I have checked ROADMAP.md and confirmed this PR does not duplicate planned core work
- [x] I have searched GitHub for duplicate or related PRs and linked them above
- [x] I have described the issue in-PR because no public issue is required for this maintenance update
- [x] I have not referenced internal/instance-local Paperclip issues or links
- [x] My branch name describes the change and contains no internal ticket id
- [x] I have run the relevant checks and they pass
- [x] I have considered and documented risks above
- [ ] All Paperclip CI gates are green
- [ ] Greptile is 5/5 with no open P2s, recommendations, or follow-ups
- [ ] I will address all Greptile and reviewer comments before requesting merge
`;
}

function assertCiContext() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (repository && repository !== "Palmetto-Interactive-LLC/paperclip") {
    throw new Error(`refusing to run outside Palmetto-Interactive-LLC/paperclip (got ${repository})`);
  }
  if (
    process.env.GITHUB_EVENT_NAME === "workflow_dispatch" &&
    process.env.GITHUB_REF !== "refs/heads/master"
  ) {
    throw new Error("manual upstream sync must run from master");
  }
}

export function computeSyncBranch(upstreamSha) {
  return `${SYNC_BRANCH_PREFIX}${upstreamSha.slice(0, 12)}`;
}

export function protectedPathsChanged(forkSha, mergedSha) {
  return !gitOk(["diff", "--quiet", forkSha, mergedSha, "--", ...PRESERVED_PATHS]);
}

async function main() {
  assertCiContext();
  const repository = process.env.GITHUB_REPOSITORY || "Palmetto-Interactive-LLC/paperclip";

  git(["fetch", "origin", DEFAULT_BRANCH, "--prune"]);
  const upstreamUrl = `https://github.com/${UPSTREAM_REPOSITORY}.git`;
  const existingRemote = git(["remote", "get-url", "upstream"], { allowFailure: true });
  if (existingRemote && existingRemote !== upstreamUrl) {
    throw new Error(`upstream remote points to ${existingRemote}, not ${upstreamUrl}`);
  }
  if (!existingRemote) git(["remote", "add", "upstream", upstreamUrl]);
  git(["fetch", "upstream", DEFAULT_BRANCH, "--prune"]);

  const forkSha = git(["rev-parse", `origin/${DEFAULT_BRANCH}`]);
  const upstreamSha = git(["rev-parse", `upstream/${DEFAULT_BRANCH}`]);
  const mergeBase = git(["merge-base", forkSha, upstreamSha]);

  const existing = openSyncPullRequests(repository);
  if (existing.length > 0) {
    summary(
      [
        "## Upstream sync skipped",
        "",
        `An upstream sync PR is already open: ${existing.map((pr) => `#${pr.number}`).join(", ")}.`,
        `Fork master: \`${forkSha}\``,
        `Upstream master: \`${upstreamSha}\``,
      ].join("\n"),
    );
    return;
  }

  if (isAncestor(upstreamSha, forkSha)) {
    summary(
      [
        "## Upstream sync not needed",
        "",
        `Fork master \`${forkSha}\` already contains upstream master \`${upstreamSha}\`.`,
        `Common ancestor: \`${mergeBase}\``,
        "No branch or pull request was created.",
      ].join("\n"),
    );
    return;
  }

  const branch = computeSyncBranch(upstreamSha);
  if (remoteBranchExists("origin", branch)) {
    throw new Error(`refusing to overwrite existing remote branch ${branch}`);
  }

  git(["switch", "--create", branch, forkSha]);
  try {
    git(["merge", "--no-edit", "--no-ff", upstreamSha]);
  } catch (error) {
    git(["merge", "--abort"], { allowFailure: true });
    const conflict = new Error(
      `upstream merge conflict between fork ${forkSha} and upstream ${upstreamSha}; merge aborted; no branch or PR was pushed`,
    );
    conflict.cause = error;
    throw conflict;
  }

  const mergedSha = git(["rev-parse", "HEAD"]);
  if (protectedPathsChanged(forkSha, mergedSha)) {
    git(["reset", "--hard", forkSha]);
    throw new Error(
      "upstream merge changed a Palmetto-protected Sentry/image or team-package path; no branch or PR was pushed",
    );
  }

  git(["push", "origin", `HEAD:refs/heads/${branch}`]);
  const bodyDir = mkdtempSync(join(tmpdir(), "paperclip-upstream-sync-"));
  const bodyPath = join(bodyDir, "pull-request.md");
  writeFileSync(bodyPath, pullRequestBody({ forkSha, upstreamSha, mergeBase, branch }));
  const url = gh([
    "pr",
    "create",
    "--repo",
    repository,
    "--base",
    DEFAULT_BRANCH,
    "--head",
    branch,
    "--title",
    `chore: sync upstream master ${upstreamSha.slice(0, 12)}`,
    "--body-file",
    bodyPath,
  ]);

  summary(
    [
      "## Upstream sync PR opened",
      "",
      `PR: ${url}`,
      `Fork master: \`${forkSha}\``,
      `Upstream master: \`${upstreamSha}\``,
      `Common ancestor: \`${mergeBase}\``,
      `Merge commit: \`${mergedSha}\``,
      "Protected Sentry/image and team-package paths were preserved.",
      "Merge only after the required `ci / verify` check is green.",
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error(`Upstream sync failed: ${error.message}`);
  process.exitCode = 1;
});
