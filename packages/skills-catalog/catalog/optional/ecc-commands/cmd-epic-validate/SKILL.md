---
name: ECC Command: epic-validate
description: Validate epic readiness, dependencies, and coordination policy.
key: paperclipai/optional/ecc-commands/cmd-epic-validate
slug: cmd-epic-validate
defaultInstall: false
recommendedForRoles:
  - engineer
  - general
requires:[]
tags:
  - ecc
  - ecc-command
  - task-recipe
  - epic
  - validate
---
> **Provenance:** Adapted from ECC `commands/epic-validate.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: epic-validate

# /epic-validate

Validate a single epic issue before publishing or review handoff.

```bash
node scripts/github-coordination.js validate <issue-number> --repo <owner/repo>
```

What this checks:

1. Coordination state exists and is parseable.
2. Validation state is satisfied by policy.
3. Declared dependencies are closed.
4. The epic is ready for the next workflow stage.

Compatibility aliases:

- `/quality-gate`
