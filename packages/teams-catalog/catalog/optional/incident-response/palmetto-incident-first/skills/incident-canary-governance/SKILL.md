---
name: incident-canary-governance
description: Apply Palmetto's incident-first authority, budget, approval, and evidence gates to a goal-linked canary task.
slug: incident-canary-governance
tags:
  - incidents
  - governance
  - least-privilege
metadata:
  paperclip:
    immutable: true
    selfModification: forbidden
---

# Incident Canary Governance

Use this skill for every canary incident task. It is a reviewed procedure, not a runtime
plugin and not permission to change itself.

## Authority

- R0: observe, preserve evidence, classify, and report.
- R1: write a goal-linked plan and request an approval.
- R2: execute the specifically approved fix in an isolated workspace.
- R3: merge or deploy only after independent verification and the required human gate.
- R4: change budgets, routing, org structure, permissions, or skills; board/human only.

No role may exceed the authority declared in its `AGENTS.md`. A missing or stale approval is
a hard stop.

## Gates and budgets

1. Link the task to the incident-canary goal/project and record evidence.
2. The coordinator classifies and requests R2 approval; no resolver acts before approval.
3. Permit at most two concurrent resolvers and at most ten verified merges per UTC day.
4. Stop at $5 per incident or $75 per UTC day; surface the gate instead of retrying.
5. The verifier is independent of the resolver and must post a pass/fail evidence report.
6. Only after a pass may the coordinator request the R3 human merge/deploy gate.

## Safe reflection

Reflection Coach may produce a trajectory-backed proposal and displayed diff for later
acceptance. It may not apply a same-run change, hot-swap instructions, or modify a skill,
tool description, budget, or policy without a separate accepted interaction.

## Reporting

Use the incident task as the system of record. Report owner, current authority, budget state,
approval state, evidence, blocker, and next action. Do not create an executive digest.
