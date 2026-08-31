---
name: ECC Command: plan-canvas
description: Open a plan or HTML artifact in the browser Plan Canvas for annotate-and-approve review
key: paperclipai/optional/ecc-commands/cmd-plan-canvas
slug: cmd-plan-canvas
defaultInstall: false
recommendedForRoles:
  - engineer
  - general
requires:[]
tags:
  - ecc
  - ecc-command
  - task-recipe
  - plan
  - canvas
---
> **Provenance:** Adapted from ECC `commands/plan-canvas.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: plan-canvas

**Argument hint:** `[path/to/artifact.plan.md | path/to/artifact.html]`

# Plan Canvas Command

Opens a local artifact in the Plan Canvas — ECC's browser review surface —
where the user annotates elements, chats with you, and approves the plan or
requests changes without leaving the page.

This command is a thin entry point over the `plan-canvas` skill. Follow that
skill for the full workflow and rules.

## What This Command Does

1. Resolve the artifact: the given path, else the most recently modified
   `.claude/plans/*.plan.md`, else ask what to review.
2. `ecc-plan-canvas open <artifact>` — opens the user's browser.
3. `ecc-plan-canvas await <artifact>` — block until feedback,
   verdict, or session end; leave it running.
4. Apply feedback to the artifact file (the canvas live-reloads), answer with
   `await <artifact> --reply "..."`, and repeat until the user approves or
   ends the session.

An `approve` verdict counts as plan confirmation for `/plan`-style gates:
stop polling, `end` the session, and begin implementation.

## Example

```
User: /plan-canvas .claude/plans/notifications.plan.md

Assistant: (runs open + await, browser opens)
...user clicks "Request changes" with two annotations...
Assistant: (edits the plan, replies in-canvas, awaits again)
...user clicks "Approve plan"...
Assistant: Plan approved in the canvas — starting implementation.
```

## Related

- `plan-canvas` skill — full workflow, feedback JSON shapes, rules
- `/plan` — produces the plan artifacts this reviews
- Source: `scripts/plan-canvas.js`, `scripts/lib/plan-canvas/`
