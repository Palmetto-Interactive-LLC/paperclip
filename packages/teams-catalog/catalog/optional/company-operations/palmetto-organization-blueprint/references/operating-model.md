# Operating Model

## RACI and handoffs

`A` is accountable, `R` performs approved work, `C` supplies bounded expertise, and `I` receives
the final status. Roles not shipped in this blueprint are written as future roles and cannot be
created implicitly.

| Outcome | A | R | C | I |
| --- | --- | --- | --- | --- |
| Incident intake and recovery decision | Incident Command Lead | separate incident canary roles | Platform Operations, Product Engineering | Alfred |
| Platform health finding | Platform Operations Lead | Watchdog | Incident Command Lead | Alfred |
| Approved maintenance cleanup | Platform Operations Lead | Janitor | Watchdog, service owner | Alfred |
| Product feature | Product Engineering Lead | future scoped implementer | Studio, independent reviewer | Alfred |
| Website or design delivery | Web and Design Studio Lead | future scoped specialist | Product Engineering, business owner | Alfred |
| Research decision package | Research and Intelligence Lead | future scoped researcher | requesting lead | Alfred |
| Manual business workflow | Business Operations Lead | future scoped operator | system owner, Studio | Alfred |
| Organization improvement | Machine Evolution Lead | future scoped evaluator | all affected leads, security reviewer | Alfred |

A handoff is incomplete unless it records the stable work identifier, accountable owner, exact
scope and exclusions, fresh inputs with provenance, required approval, budget remaining,
acceptance evidence, rollback or recovery path, and next owner. Reject a handoff with ambiguous
identity, stale evidence, missing credentials boundary, no acceptance surface, or unrelated work.

## Budget envelope

The sidecar's role caps total $190 per month: Alfred $40; Product Engineering $40; Platform
Operations and Web and Design $20 each; Incident Command, Research, Business Operations, and
Machine Evolution $15 each; Janitor and Watchdog $5 each. These are ceilings, not spending
targets or authorization to run.

Phase 0 has a $0 execution budget because every role is inert. Before each later canary, the
board must approve the one activated role's lower task budget, provider ceiling, stop condition,
and cost readback. Do not activate the full $190 envelope at once. OpenRouter free or low-cost
models do not remove privacy, quality, or rate-limit review.

## Model routing policy

- Alfred's existing Claude Code router is the primary orchestrator only after its binding,
  account, and data boundary are verified outside this package.
- Codex is the candidate for repository implementation, tests, review, and exact artifact work.
- Grok is the candidate for independent challenge, broad synthesis, and time-sensitive research
  after sources and data sensitivity are reviewed.
- Cursor is the candidate for editor-centered implementation where its runtime and repository
  access are already governed.
- OpenRouter is the candidate for cheap or free specialty models only from an allowlisted,
  evaluated model set with known retention, privacy, rate, and quality behavior.

Routing is advisory here; the package defines no adapter, provider, endpoint, model, or
credential. The board must map each route to an enforced runtime boundary and fail to a human
when no reviewed route fits. Never silently fall back to a model with a weaker data policy.
