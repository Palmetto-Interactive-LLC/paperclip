# Safe Reconciliation

This package contains no executable reconciler. Any future board-approved reconciler must use
the following read-before-create algorithm and be tested against the live API, not a UI route.

1. List current company agents and normalize their names to stable slugs.
2. Compare that set with the ten desired slugs in this package.
3. Preserve an exact match's ID and configuration unless a separately reviewed diff authorizes
   an update. Never create or rename a second Alfred, Janitor, Watchdog, or department lead.
4. Stop for duplicate or ambiguous matches. A fuzzy title match is not sufficient.
5. Create only an absent slug, using the package's inert runtime and permission settings.
6. Re-read the organization, verify reporting edges and inert settings, then run the same plan
   again. The second plan must contain zero creates and zero renames.

For a catalog import into an existing Palmetto company, preview with collision strategy `skip`.
An existing Alfred must remain the root, all seven leads must report to that exact agent ID, and
Janitor and Watchdog must report to the exact Platform Operations Lead ID. Do not use the
importer's default rename behavior for reconciliation.

The incident cell is a separate operation: preview `palmetto-incident-first` with collision
strategy `skip` and the existing Incident Command Lead as target manager. Reject the preview if
it proposes a duplicate role, external source, credential, routine, task, or unexpected write.

## Acceptance gates before any activation

- Catalog validation and the inert-install integration test pass at the reviewed commit.
- Independent security review finds no executable, provider configuration, secret, task,
  routine, trigger, or ignored enforcement claim.
- The live preview proposes only intended creates/skips and a second preview is idempotent.
- The role has a scoped adapter, credential, resource grant, task budget, owner, and rollback.
- One canary produces acceptance evidence on the real target surface within its cost ceiling.
- The board reads back runtime, repository, tracker, and provider state before expanding scope.

Until every applicable gate passes, leave timer and non-timer wakeups disabled.
