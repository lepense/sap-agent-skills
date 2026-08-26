# sap-agent-skills

Curated, **verified** SAP skills for AI coding agents — portable across **Claude Code**
(CLI + VS Code) and **GitHub Copilot** (VS Code), with quality enforced by evals, a
source-verification ledger, and CI.

Inspired by [capire/skills](https://github.com/capire/skills) (quality bar, evals) and
[secondsky/sap-skills](https://github.com/secondsky/sap-skills) (breadth), but written from
scratch under the permissive **MIT** license.

## Why this exists

- **Verified, not vibes.** Every version-sensitive claim is recorded in
  [`ledger/sources.json`](ledger/sources.json) with its official source and how it was
  checked (see [verification policy](docs/verification-policy.md)).
- **Tested.** Every skill ships eval scenarios that assert it actually documents the
  behavior it promises. CI runs them.
- **Portable.** The portable core is `SKILL.md`; Claude-only extras never lock other tools
  out (see [portability](docs/portability.md)).

## Install

**Claude Code** (CLI or VS Code):
```
/plugin marketplace add <owner>/sap-agent-skills
/plugin install sap-cap
```

**GitHub Copilot (VS Code)** and other open-skill tools:
```
npx skills add <owner>/sap-agent-skills
```

## Repository layout

```
plugins/<domain>/                 # one SAP domain per plugin
  .claude-plugin/plugin.json
  skills/<name>/SKILL.md          # portable core (+ references/, templates/, evals/)
  commands/  agents/  hooks/  .mcp.json   # Claude-only, optional
schemas/                          # JSON Schemas (plugin, skill frontmatter, ledger)
scripts/                          # validate, sync-manifests, run-evals (+ tests)
ledger/sources.json               # source-verification ledger
.claude-plugin/marketplace.json   # generated catalog
docs/                             # authoring, portability, verification
```

## Available plugins

| Plugin | Description |
|---|---|
| [`sap-cap`](plugins/sap-cap) | Build and extend SAP CAP apps (Node.js or Java) declarative-first — CDS modeling, services, handlers, Fiori annotations, security, deployment. Includes commands, agents, a `cds compile` hook, and CAP MCP wiring. |
| [`sapui5`](plugins/sapui5) | Build SAPUI5 / OpenUI5 apps — MVC with XML views, models and data binding, `manifest.json`, routing, UI5 Tooling, and Fiori elements. Includes commands, agents, and a manifest-lint hook. |
| [`sap-fiori-tools`](plugins/sap-fiori-tools) | Generate, model, and preview SAP Fiori elements apps — Application Generator, Page Map, Guided Development, annotation tooling, and mock/backend preview. Includes commands, agents, and a hook. |
| [`sap-abap`](plugins/sap-abap) | Modern ABAP with ABAP Cloud and clean core — the RESTful Application Programming Model (RAP), OO ABAP, ADT, and ABAP Unit. Includes commands, agents, and RAP templates. |
| [`sap-abap-cds`](plugins/sap-abap-cds) | Model ABAP Core Data Services — view entities, associations, the Virtual Data Model, annotations, DCL access control, and analytics. Includes commands, agents, and CDS templates. |

_More domains (BTP, HANA, SAC) land in later phases, each reusing the golden template._

## Quality gates

```bash
npm test          # engine unit tests
npm run validate  # schemas + required files
npm run evals     # eval scenarios
npm run sync      # regenerate marketplace.json
```

## Contributing

See the [authoring guide](docs/authoring-guide.md). New domains reuse the `sap-cap`
template. Content is authored fresh (no copying from GPL-licensed sources) and verified
before it ships.

## License

[MIT](LICENSE).
