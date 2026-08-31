---
name: ECC Command: epic-publish
description: Publish a validated epic update back to the issue and local cache.
key: paperclipai/optional/ecc-commands/cmd-epic-publish
slug: cmd-epic-publish
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
  - publish
---
> **Provenance:** Adapted from ECC `commands/epic-publish.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: epic-publish

# /epic-publish

Publish a validated coordination update to GitHub.

```bash
node scripts/github-coordination.js publish <issue-number> --repo <owner/repo>
```

What this does:

1. Re-validates the epic before publishing.
2. Updates the coordination block in the issue body.
3. Appends a concise publish comment.
4. Records the final local snapshot.

Compatibility aliases:

- `/pr`
- `/prp-pr`
