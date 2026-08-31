---
name: ECC Command: model-route
description: Recommend the best model tier for the current task based on complexity, risk, and budget.
key: paperclipai/optional/ecc-commands/cmd-model-route
slug: cmd-model-route
defaultInstall: false
recommendedForRoles:
  - engineer
  - general
requires:[]
tags:
  - ecc
  - ecc-command
  - task-recipe
  - model
  - route
---
> **Provenance:** Adapted from ECC `commands/model-route.md` (slash-command recipe). Imported from ECC (ecc-universal) by Affaan Mustafa (https://github.com/affaan-m/ECC), mirrored at https://github.com/Palmetto-Interactive-LLC/ECC, MIT License. Copyright (c) 2026 Affaan Mustafa.

# ECC Command Recipe: model-route

# Model Route Command

Recommend the best model tier for the current task by complexity and budget.

## Usage

`/model-route [task-description] [--budget low|med|high]`

## Routing Heuristic

- `haiku`: deterministic, low-risk mechanical changes
- `sonnet`: default for implementation and refactors
- `opus`: architecture, deep review, ambiguous requirements

## Required Output

- recommended model
- confidence level
- why this model fits
- fallback model if first attempt fails

## Arguments

$ARGUMENTS:
- `[task-description]` optional free-text
- `--budget low|med|high` optional
