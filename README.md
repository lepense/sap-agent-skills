# sap-agent-skills

[![validate](https://github.com/lepense/sap-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/lepense/sap-agent-skills/actions/workflows/validate.yml)
[![evals](https://github.com/lepense/sap-agent-skills/actions/workflows/evals.yml/badge.svg)](https://github.com/lepense/sap-agent-skills/actions/workflows/evals.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Curated, **verified** skills for building **SAP CAP** applications **full-stack** with AI
coding agents — the CAP backend (CDS + services) plus its UI layer (SAPUI5 and SAP Fiori
tools). Portable across **Claude Code** (CLI + VS Code) and **GitHub Copilot** (VS Code),
with quality enforced by evals, a source-verification ledger, and CI.

Focused on the CAP stack: model your domain and services with `sap-cap`, build the UI with
`sapui5`, and generate/preview Fiori elements apps with `sap-fiori-tools`.

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
/plugin marketplace add lepense/sap-agent-skills
/plugin install sap-cap
/plugin install sapui5
/plugin install sap-fiori-tools
```

**GitHub Copilot (VS Code)** and other open-skill tools:
```
npx skills add lepense/sap-agent-skills
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
| [`cap-testing`](plugins/cap-testing) | Test CAP apps — the `cds.test` harness, HTTP + programmatic service tests, authentication/mock users, test data, Java (JUnit) tests, and CI. Includes commands and agents. |
| [`cap-deploy`](plugins/cap-deploy) | Deploy CAP apps to SAP BTP — production facets, MTA on Cloud Foundry, Kyma/Helm, SAP HANA, XSUAA/approuter, hybrid testing, multitenancy, and CI/CD. Includes commands, agents, and templates. |

These cover the CAP full-stack: **backend/services** (`sap-cap`), **freestyle UI**
(`sapui5`), **Fiori elements** (`sap-fiori-tools`), **testing** (`cap-testing`), and
**deployment** (`cap-deploy`).

## Quality gates

```bash
npm test          # engine unit tests
npm run validate  # schemas + required files
npm run evals     # eval scenarios
npm run sync      # regenerate marketplace.json
```

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[authoring guide](docs/authoring-guide.md). New skills reuse the existing plugin structure;
content is authored fresh (no copying from GPL-licensed sources) and verified against
official SAP sources before it ships.

## License

[MIT](LICENSE).
