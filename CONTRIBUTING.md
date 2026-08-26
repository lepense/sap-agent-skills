# Contributing to sap-agent-skills

Thanks for your interest! This repo provides **verified**, portable SAP CAP skills for AI
coding agents (Claude Code + GitHub Copilot). Contributions that keep the quality bar high are
very welcome.

## Scope

This project is focused on the **SAP CAP full-stack**:

- `sap-cap` — CAP backend: CDS modeling, services, handlers (Node.js / Java).
- `sapui5` — freestyle SAPUI5 / OpenUI5 UI.
- `sap-fiori-tools` — SAP Fiori tools / Fiori elements.

Proposals should serve CAP application development. Non-CAP SAP stacks (e.g. on-premise ABAP)
are out of scope for this repo.

## Ground rules

1. **Verified, not vibes.** Every version-sensitive claim (package names/versions, CLI flags,
   API/annotation names) must be recorded in [`ledger/sources.json`](ledger/sources.json) with
   an official source and how it was checked. See [docs/verification-policy.md](docs/verification-policy.md).
2. **MIT, written fresh.** Do not copy text from GPL-licensed sources (e.g. secondsky/sap-skills).
   Author content yourself and cite official SAP docs.
3. **Tested.** Every skill ships eval scenarios under `evals/` that assert it documents the
   behavior it promises. Add/adjust evals with your change.
4. **Portable core.** Keep required knowledge in `SKILL.md` (+ `references/`, `templates/`).
   Reserve `commands/`, `agents/`, `hooks/`, `.mcp.json` for Claude-only ergonomics — see
   [docs/portability.md](docs/portability.md).

## Adding or changing a skill

Follow the [authoring guide](docs/authoring-guide.md). In short:

- A plugin lives under `plugins/<name>/` with `.claude-plugin/plugin.json` and
  `skills/<name>/SKILL.md` (open-skill frontmatter: `name`, `description`, `license`).
- Add `references/`, `templates/`, and `evals/` as needed.
- Record verifications in the ledger.

## Before opening a PR

Run the full quality gate locally — CI runs the same checks:

```bash
npm ci
npm test          # engine unit tests
npm run validate  # schemas + required files
npm run evals     # eval scenarios
npm run sync      # regenerate .claude-plugin/marketplace.json (commit the result)
```

`npm run sync` must leave `marketplace.json` unchanged in CI, so always run it after adding or
renaming a plugin and commit the regenerated file.

## Commit and PR

- Small, focused commits with clear messages.
- Describe what changed and how you verified it (which official docs, which evals).
- One logical change per PR where possible.

## Reporting issues

Open a GitHub issue with the plugin name, what you expected, and what you observed (include the
CAP / UI5 / Fiori tools version where relevant).
