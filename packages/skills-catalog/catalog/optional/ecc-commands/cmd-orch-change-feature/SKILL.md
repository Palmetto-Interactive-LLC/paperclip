---
name: ECC Command: orch-change-feature
description: Orchestrate altering an existing, working feature to new desired behavior — update tests to the new spec, change impl, review, gated commit. Wrapper for the orch-change-feature skill.
key: paperclipai/optional/ecc-commands/cmd-orch-change-feature
slug: cmd-orch-change-feature
defaultInstall: false
recommendedForRoles:
  - engineer
  - general
requires:[]
tags:
  - ecc
  - ecc-command
  - task-recipe
  - orch
  - change
  - feature
---
> **Provenance:** Adapted from ECC `commands/orch-change-feature.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: orch-change-feature

# /orch-change-feature

Manually launch the **orch-change-feature** orchestrator: change behavior that
already works to a new desired spec, tests-first.

## Usage

```
/orch-change-feature <the new desired behavior>
```

Examples:

```
/orch-change-feature make nws-poller alert at 2 warnings instead of 3
/orch-change-feature instead of sorting by date, sort by priority
```

## What It Does

Invoke the `orch-change-feature` skill with `$ARGUMENTS` as the request. The skill
(via the shared `orch-pipeline` engine) will:

1. Classify size (default floor: small) and state the tier.
2. Light plan only if the new behavior needs research. → **GATE 1** (approve changed-test plan).
3. **Update the existing tests** to express the new behavior, then change the
   implementation until green. (Changing the tests first is what makes this a
   tweak, not a fix.)
4. `code-reviewer` (+ `security-reviewer` on a security trigger), then commit. → **GATE 2**.

Use this only when the feature **works** but should behave differently — not for
bugs (`/orch-fix-defect`) or net-new capability (`/orch-add-feature`).

If `$ARGUMENTS` is empty, ask the user what behavior should change.
