# Palmetto Organization Blueprint

Version 1.0.0 is an optional, paused-by-construction reference package for Palmetto's future
Paperclip organization. A fresh install creates ten inert roles under one company: Alfred,
seven department leads, Janitor, and Watchdog. It does not create work or schedule execution.

The sidecar uses only settings enforced by the current importer: per-agent monthly caps,
agent- and skill-creation permissions, heartbeat wake policy, and concurrency. Role text,
handoffs, RACI, model routing, approval gates, and reconciliation steps are operating guidance,
not access controls. Actual adapters, grants, credentials, and resource boundaries must be
configured and verified separately before any role is enabled.

For an existing Palmetto company, preview with collision strategy `skip`. Preserve the existing
Alfred ID, match every desired role by stable normalized slug, reject ambiguous matches, and
create only absent roles. Never use rename to reconcile the blueprint. The same reconciliation
run must be idempotent and produce zero new agents on its second pass.

The package intentionally has no provider credentials, model settings, skills, projects,
tasks, routines, triggers, scripts, or external sources. Importing it must not mutate the live
organization until a board-approved reconciliation is run.
