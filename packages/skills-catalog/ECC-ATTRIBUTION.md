# ECC Import — Provenance and License

This catalog imports content from **ECC** (`ecc-universal`), a harness-native
skills/agents/commands/rules collection by Affaan Mustafa:

- Upstream: https://github.com/affaan-m/ECC
- Mirror pinned for this import: https://github.com/Palmetto-Interactive-LLC/ECC
- Commit pinned: `005eff40fd4a4ac005da7a70e713459175385516`
- License: MIT (Copyright (c) 2026 Affaan Mustafa)

## What was imported

- `skills/*` (286 entries) → `catalog/optional/ecc/<slug>`. Most are
  `catalog-ref.json` references pinned to the commit above and fetched live
  from GitHub at manifest-build time. Skills whose upstream description
  exceeds Paperclip's 300-character catalog cap are vendored locally instead
  (full original description preserved in the body) since a reference can't
  rewrite upstream frontmatter.
- `agents/*` (68 subagent persona definitions) → `catalog/optional/ecc-agents/<slug>`,
  vendored locally with Paperclip-conformant frontmatter wrapping the
  original persona prompt.
- `commands/*` (94 slash-command recipes) → `catalog/optional/ecc-commands/cmd-<slug>`,
  vendored locally. Slugs are prefixed `cmd-` because several command names
  collide with same-named ECC skills (e.g. `security-scan`, `plan-canvas`).
- `rules/*` (22 per-language rule sets) → `catalog/optional/ecc-rules/<lang>`,
  vendored locally, one skill per language concatenating that language's rule
  files.

Every generated `SKILL.md` carries a `> **Provenance:**` line naming its exact
upstream source file and this license notice. All imported entries have
`defaultInstall: false` — nothing here is installed automatically.

## Why some skills are vendored instead of referenced

Paperclip's skill-reference mechanism (`catalog-ref.json`) fetches
`SKILL.md` from the pinned commit at build time and cannot rewrite its
frontmatter. Paperclip's own catalog tests cap frontmatter descriptions at
300 characters. Where an upstream description exceeds that cap, the skill is
vendored locally instead so the shipped frontmatter description can be
shortened while the full original text is kept in the body.

## Updating the pin

To move to a newer ECC commit, update `commit` (and `ref` if needed) in the
affected `catalog-ref.json` files, re-run
`pnpm --filter @paperclipai/skills-catalog build:manifest`, and re-vendor any
skill whose description newly exceeds the 300-character cap.
