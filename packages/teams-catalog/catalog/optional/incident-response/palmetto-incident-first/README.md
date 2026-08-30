# Palmetto Incident First

Optional Paperclip team package for an incident-first canary. Import the team through the
Paperclip teams catalog, review the generated import plan, and keep automations paused until
the board accepts the displayed plan.

The package is intentionally small: three active agents, one goal-linked project, one
coalescing watch routine, and one local governance skill. `Useful Feature Delivery` and
`Machine Evolution` are paused definitions in `.paperclip.yaml`, not active agents.

The local skill follows the official Paperclip Skills Store / Reflection Coach safety shape:
skills are reusable, inspectable packages; reflection produces a reviewable proposal and
cannot hot-swap instructions. No community runtime plugin is included or required.

The sidecar carries Paperclip-only budgets, authority levels, approval gates, reporting
policy, tool allowlists, and routine trigger fidelity. It contains no credentials or
machine-specific paths.
