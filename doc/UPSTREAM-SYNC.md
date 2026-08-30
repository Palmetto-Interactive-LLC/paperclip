# Upstream sync

The Palmetto fork follows `paperclipai/paperclip` but keeps a small set of
fork-owned production changes. `.github/workflows/upstream-sync.yml` checks
for upstream `master` changes every day at 05:17 UTC and can also run from
`master` through **Actions → Upstream sync → Run workflow**.

The workflow is deliberately PR-only:

1. It checks out the fork's current `master` and fetches upstream `master`.
2. If upstream is already an ancestor, it records that no update is needed.
3. Otherwise it creates `automation/upstream-sync-<upstream-sha>` from fork
   `master` and performs a non-fast-forward merge.
4. A merge conflict or any change to a protected Palmetto path fails closed.
   The workflow never force-pushes and never pushes `master`.
5. A successful merge is pushed once and opened as a review PR. The PR must
   pass the required `ci / verify` status check before merge.

The protected paths cover the Sentry/image work and the Palmetto incident team
package. A change to one of those paths is an ownership decision for a human;
the automation does not silently choose an upstream or fork version.

An existing open `automation/upstream-sync-*` PR blocks another one. This keeps
one review queue and avoids overwriting a branch that a reviewer may be using.
After a PR merges, the next scheduled run starts from the new fork `master`.
