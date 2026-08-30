# Palmetto Incident First

Optional, paused-by-construction reference package for an incident canary. A normal catalog
install creates three role blueprints with timer heartbeats disabled, on-demand wakeups
disabled, and one-run concurrency. It installs no routine or trigger; the watch checklist is
a non-imported reference. Importing this package must not start an agent or automation.

The package contains only the runtime controls Paperclip currently enforces here: monthly
budgets, agent- and skill-creation permissions, heartbeat policy, and project status. The
authority and approval language in the role files is an operating checklist, not an
access-control boundary or a substitute for scoped credentials.

Before activation, the board must review the generated import plan, attach the team beneath
the intended manager, configure a least-privilege adapter and secrets, set explicit resource
permissions, and enable only the role needed for a bounded canary. The package contains no
credentials, executable hooks, scheduled automation, or machine-specific paths.
