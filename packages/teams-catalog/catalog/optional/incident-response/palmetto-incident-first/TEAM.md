---
name: Palmetto Incident First
description: Paused incident-canary role blueprints for coordinated resolution and independent verification under board-controlled activation.
schema: agentcompanies/v1
slug: palmetto-incident-first
category: incident-response
key: paperclipai/optional/incident-response/palmetto-incident-first
manager: agents/incident-coordinator/AGENTS.md
includes:
  - agents/resolver/AGENTS.md
  - agents/independent-verifier/AGENTS.md
  - projects/incident-canary/PROJECT.md
  - skills/incident-canary-governance/SKILL.md
defaultInstall: false
recommendedForCompanyTypes:
  - software
  - platform
  - operations
tags:
  - incidents
  - canary
  - governance
  - least-privilege
requiredSkills:
  - paperclipai/bundled/paperclip-operations/issue-triage
  - paperclipai/bundled/software-development/github-pr-workflow
  - paperclipai/bundled/quality/qa-acceptance
---

# Palmetto Incident First

This package installs three inert role blueprints: Incident Coordinator, Resolver, and
Independent Verifier. The coordinator owns intake and assignment, the resolver owns one
bounded fix, and the verifier independently proves or rejects the result.

The sidecar disables timer and on-demand wakeups for every role, caps each role at one
concurrent run, and imports the watch routine paused with its trigger disabled. The board
must configure credentials, grants, and activation after reviewing the import plan.

Use the `incident-canary` project as the work record. The role instructions and local skill
are operational guidance, not runtime authorization controls. This package does not define
feature-delivery, machine-evolution, or executive-digest automation.
