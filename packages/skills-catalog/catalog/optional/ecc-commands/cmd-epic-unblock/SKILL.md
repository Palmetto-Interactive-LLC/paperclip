---
name: ECC Command: epic-unblock
description: Sweep blocked epic issues and reopen anything whose dependencies are closed.
key: paperclipai/optional/ecc-commands/cmd-epic-unblock
slug: cmd-epic-unblock
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
  - unblock
---
> **Provenance:** Adapted from ECC `commands/epic-unblock.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: epic-unblock

# /epic-unblock

Sweep blocked epics whose declared dependencies are complete.

```bash
node scripts/github-coordination.js unblock --repo <owner/repo>
```

What this does:

1. Scans epic issues in the repository.
2. Checks each blocked epic's dependency list.
3. Moves fully unblocked epics to ready.
4. Updates labels, comments, and local snapshots.

Compatibility aliases:

- `/loop-status`
