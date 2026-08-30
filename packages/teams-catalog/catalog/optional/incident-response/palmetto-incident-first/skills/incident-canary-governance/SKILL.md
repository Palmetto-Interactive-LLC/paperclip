---
name: incident-canary-governance
description: Apply Palmetto's incident-first review checklist to a board-activated canary task.
slug: incident-canary-governance
tags:
  - incidents
  - governance
  - least-privilege
---

# Incident Canary Governance

Use this skill for every board-activated canary incident task. It is a review checklist, not
a runtime plugin, access-control boundary, approval mechanism, or permission to change
itself.

## Operating scope

- The coordinator observes, preserves evidence, classifies, and requests approval.
- The resolver executes only the specifically approved fix in an isolated workspace.
- The verifier independently reproduces recovery and returns a recommendation.
- A human performs or explicitly approves merge, deployment, incident closure, and changes
  to budgets, routing, organization structure, permissions, credentials, or skills.

Paperclip does not enforce these role sentences as permissions. Before activation, the board
must configure actual grants, scoped credentials, and adapter isolation that match the task.

## Review checklist

1. Link the task to the incident-canary project and record provider identifiers.
2. Fetch current evidence inside the trusted process; reject caller-supplied provider status.
3. Require a fresh human approval before the resolver acts.
4. Keep one resolver run active; stop instead of expanding scope or retrying without bounds.
5. Have a different verifier post a pass/fail report using live recovery evidence.
6. After a pass, ask a human to approve or perform merge, deployment, and provider closure.
7. Read back repository, deployment, Sentry, and PagerDuty state before marking work done.

## Safe reflection

Reflection may produce a proposal and displayed diff for later board review. It may not
apply a same-run change or be treated as authorization to change instructions, skills,
tools, budgets, credentials, or policy.

## Reporting

Use the incident task as the work record. Report owner, approval state, fresh evidence,
blocker, and next action. Do not create an executive digest.
