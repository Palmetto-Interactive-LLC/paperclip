# Blueprint v1.0.0

## Fixed scope

This blueprint represents one Palmetto company. Alfred is the single accountable root. The
departments are Incident Command, Platform Operations, Product Engineering, Web and Design
Studio, Research and Intelligence, Business Operations, and Machine Evolution. Janitor and
Watchdog are inert specialists beneath the Platform Operations Lead and Machine Steward.

The package is an organization definition only. It creates no work records, schedules,
triggers, credentials, integrations, or provider bindings, and it does not mutate a live
company by being present in the catalog.

## Phased staffing

0. Source and preview: validate the package, review the import plan, and leave every role inert.
1. Incident canary: activate only the Incident Command Lead and, after a separate preview,
   attach the existing `palmetto-incident-first` package for one approved incident.
2. Platform observation: activate the Platform Operations Lead and Watchdog for one read-only
   health canary. Janitor stays inert until exact cleanup controls and restore evidence pass.
3. Delivery canary: activate either Product Engineering or the Web and Design Studio for one
   bounded outcome, with independent verification and a hard budget.
4. Decision support: activate Research or Business Operations for one internal, non-mutating
   work product with a named human recipient.
5. Machine evolution: activate only after other lanes produce measured bottlenecks. Changes to
   routing, memory, graphs, skills, or organization policy remain reviewed source changes.

Advance one phase at a time. Each phase must show useful completed work, bounded cost, clean
handoffs, no duplicate roles, and a tested rollback before the next staffing decision. This
follows the practical guidance to start with a small company and clear roles, observe handoffs,
then add agents and integrations incrementally.

## Tenant rule

Create another Paperclip company only for a real legal, credential, or data boundary. Meridian7,
OppIntell, Shelter, and possibly Infrastructure are future tenant candidates, not departments
inside Palmetto and not part of this package. Each candidate requires its own vault, runtime,
budget, and data-flow audit before creation.

Alfred must never receive another tenant's credentials or unsanitized operating data. Future
portfolio reporting must cross tenant boundaries only as a deliberately sanitized summary.
