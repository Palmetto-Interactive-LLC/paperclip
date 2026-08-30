---
name: Palmetto Organization Blueprint v1
description: Inert, versioned Palmetto operating-model roles for incremental staffing beneath Alfred with explicit activation gates.
schema: agentcompanies/v1
blueprintVersion: 1.0.0
slug: palmetto-organization-blueprint
category: company-operations
key: paperclipai/optional/company-operations/palmetto-organization-blueprint
manager: agents/alfred/AGENTS.md
includes:
  - agents/incident-command-lead/AGENTS.md
  - agents/platform-operations-lead/AGENTS.md
  - agents/product-engineering-lead/AGENTS.md
  - agents/web-design-studio-lead/AGENTS.md
  - agents/research-intelligence-lead/AGENTS.md
  - agents/business-operations-lead/AGENTS.md
  - agents/machine-evolution-lead/AGENTS.md
  - agents/janitor/AGENTS.md
  - agents/watchdog/AGENTS.md
  - references/blueprint-v1.md
  - references/operating-model.md
  - references/knowledge-and-extension-governance.md
  - references/reconciliation.md
defaultInstall: false
recommendedForCompanyTypes:
  - software
  - platform
  - agency
tags:
  - organization
  - operating-model
  - incremental-staffing
  - governance
  - palmetto
---

# Palmetto Organization Blueprint v1

This package records one Palmetto company with Alfred at the top, seven department leads,
and two inert maintenance specialists. It is a source-controlled organization plan, not a
request to create another Paperclip company or activate the live organization.

Every packaged agent has timer and non-timer wakeups disabled, one-run concurrency, and no
agent- or skill-creation permission. The package contains no tasks, projects, routines,
triggers, credentials, provider configuration, executable hooks, or external dependencies.
Its role instructions guide later board-approved work; they are not runtime authorization.

The existing `paperclipai/optional/incident-response/palmetto-incident-first` package is a
separate, inert implementation candidate beneath the Incident Command Lead. Paperclip has no
safe package-composition primitive, so this blueprint references that package but does not
copy or automatically install its Coordinator, Resolver, or Independent Verifier roles.

Read the versioned references before previewing an import. Existing agents must be matched by
stable normalized slug and skipped, never renamed or duplicated. Activation remains a
separate, explicit board change after the acceptance gates pass.
