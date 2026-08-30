---
name: Palmetto Incident First
description: Incident-first canary team with a coordinator, resolver, and independent verifier under explicit authority and budget gates.
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

This package is the smallest useful incident canary for Palmetto. It starts with exactly
three active roles: Incident Coordinator, Resolver, and Independent Verifier. The
coordinator owns intake and assignment, the resolver owns a bounded fix, and the verifier
independently proves or rejects the result.

Useful Feature Delivery and Machine Evolution are named as paused future tracks in the
Paperclip sidecar. They are not agents in this canary and cannot receive work until a board
decision enables them.

All work must link to the `incident-canary` project and the company's incident-first goal.
There is no executive-digest routine. Reflection Coach is an official review pattern only:
it may propose a reviewed change, but no agent may hot-swap its own instructions or skills.
