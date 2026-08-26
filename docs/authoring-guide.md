# Authoring guide: adding a plugin

A plugin is one SAP domain. Copy the shape of `plugins/sap-cap/` and adapt it.

## Required layout

```
plugins/<name>/
├─ .claude-plugin/plugin.json          # required
└─ skills/<name>/
    └─ SKILL.md                        # required (open-skill frontmatter)
```

Optional (Claude-only): `commands/*.md`, `agents/*.md`, `hooks/hooks.json`, `.mcp.json`,
and inside the skill: `references/*.md`, `templates/*`, `evals/*.json`.

## `plugin.json` (validated by `schemas/plugin.schema.json`)

Required: `name` (kebab-case), `version` (semver), `description` (≥10 chars), `license`.
Optional: `author`, and pointers `commands`, `agents`, `hooks`, `mcpServers`.

## `SKILL.md` frontmatter (validated by `schemas/skill-frontmatter.schema.json`)

```markdown
---
name: <kebab-case>
description: <≥20 chars, what the skill helps build>
license: MIT
---
```

Keep the body lean and decision-oriented; defer detail to `references/`. See
[portability.md](portability.md) for what belongs in the skill vs. the Claude layer.

## Evals (`skills/<name>/evals/*.json`)

Each scenario asserts that a target file documents the expected behavior:

```json
{ "name": "declarative-first present", "against": "SKILL.md",
  "assert": { "mustInclude": ["Declarative first", "annotation"], "mustNotInclude": [] } }
```

`against` defaults to `SKILL.md`; point it at a reference file to test that doc instead.

## Verification

Record every version-sensitive claim in `ledger/sources.json` — see
[verification-policy.md](verification-policy.md).

## Before committing

```bash
npm test          # engine unit tests
npm run validate  # schemas + required files
npm run evals     # scenario rubrics
npm run sync      # regenerate .claude-plugin/marketplace.json
```

CI runs the same gates and fails if `marketplace.json` is out of date, so always run
`npm run sync` after adding or renaming a plugin.
