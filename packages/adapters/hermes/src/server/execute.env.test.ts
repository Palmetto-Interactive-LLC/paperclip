/**
 * Regression tests for the ECC memory vault harness-identity env var.
 *
 * The `eccMemoryVault` adapter config toggle should set
 * ECC_MEMORY_HARNESS=hermes for the spawned Hermes process, but only as a
 * default — an explicit config.env override must still win.
 */

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@paperclipai/adapter-utils/server-utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@paperclipai/adapter-utils/server-utils")>();
  return {
    ...actual,
    runChildProcess: vi.fn(async () => ({
      exitCode: 0,
      signal: null,
      timedOut: false,
      stdout: "",
      stderr: "",
    })),
  };
});

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(async () => ""),
  writeFile: vi.fn(async () => undefined),
  mkdir: vi.fn(async () => undefined),
  rm: vi.fn(async () => undefined),
  access: vi.fn(async () => undefined),
  readdir: vi.fn(async () => []),
  stat: vi.fn(async () => ({ isFile: () => true, isDirectory: () => false })),
}));

import { execute } from "./execute.js";
import * as serverUtils from "@paperclipai/adapter-utils/server-utils";

function makeCtx(overrides: Record<string, unknown> = {}) {
  return {
    runId: "test-run-1",
    agent: {
      id: "agent-1",
      companyId: "company-1",
      name: "Hermes",
      adapterType: "hermes_local",
      adapterConfig: {},
    },
    runtime: {
      sessionId: null,
      sessionParams: null,
      sessionDisplayId: null,
      taskKey: null,
    },
    config: {
      command: "/usr/bin/hermes",
      timeoutSec: 60,
      graceSec: 5,
      ...overrides,
    },
    context: {
      issueId: "issue-1",
      wakeReason: "manual",
      paperclipWake: null,
    },
    onLog: vi.fn(async () => undefined),
    onMeta: vi.fn(async () => undefined),
    onSpawn: vi.fn(async () => undefined),
  } satisfies Record<string, unknown>;
}

async function lastSpawnedEnv(): Promise<Record<string, string>> {
  const mocked = vi.mocked(serverUtils.runChildProcess);
  const lastCall = mocked.mock.calls[mocked.mock.calls.length - 1];
  const opts = lastCall[3] as { env: Record<string, string> };
  return opts.env;
}

describe("hermes-local adapter ECC memory vault env", () => {
  const previousHarness = process.env.ECC_MEMORY_HARNESS;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ECC_MEMORY_HARNESS;
  });

  afterAll(() => {
    if (previousHarness === undefined) delete process.env.ECC_MEMORY_HARNESS;
    else process.env.ECC_MEMORY_HARNESS = previousHarness;
  });

  it("does not set ECC_MEMORY_HARNESS when eccMemoryVault is disabled", async () => {
    await execute(makeCtx() as any);
    const env = await lastSpawnedEnv();
    expect(env.ECC_MEMORY_HARNESS).toBeUndefined();
  });

  it("sets ECC_MEMORY_HARNESS=hermes when eccMemoryVault is enabled", async () => {
    await execute(makeCtx({ eccMemoryVault: true }) as any);
    const env = await lastSpawnedEnv();
    expect(env.ECC_MEMORY_HARNESS).toBe("hermes");
  });

  it("lets an explicit config.env override win over the eccMemoryVault default", async () => {
    await execute(
      makeCtx({ eccMemoryVault: true, env: { ECC_MEMORY_HARNESS: "custom-hermes" } }) as any,
    );
    const env = await lastSpawnedEnv();
    expect(env.ECC_MEMORY_HARNESS).toBe("custom-hermes");
  });
});
