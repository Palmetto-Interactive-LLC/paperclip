---
name: ECC Command: hookify-list
description: List all configured hookify rules (imported from ECC, an open-source AI agent harness skill/rule/persona collection).
key: paperclipai/optional/ecc-commands/cmd-hookify-list
slug: cmd-hookify-list
defaultInstall: false
recommendedForRoles:
  - engineer
  - general
requires:[]
tags:
  - ecc
  - ecc-command
  - task-recipe
  - hookify
  - list
---
> **Provenance:** Adapted from ECC `commands/hookify-list.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: hookify-list

Find and display all hookify rules in a formatted table.

## Steps

1. Find all `.claude/hookify.*.local.md` files
2. Read each file's frontmatter:
   - `name`
   - `enabled`
   - `event`
   - `action`
   - `pattern`
3. Display them as a table:

| Rule | Enabled | Event | Pattern | File |
|------|---------|-------|---------|------|

4. Show the rule count and remind the user that `/hookify-configure` can change state later.
