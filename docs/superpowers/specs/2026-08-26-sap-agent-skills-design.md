# sap-agent-skills — Design (Phase 1)

**Date:** 2026-08-26
**Status:** Approved (design), pending implementation plan
**Scope of this document:** Phase 1 only — repository foundation + the `sap-cap` "golden" plugin. Later phases each get their own spec → plan → implementation cycle.

---

## 1. Motivation

Two existing repos inspire this project:

- **capire/skills** (SAP SE, Apache-2.0): narrow but high quality. 4 CAP skills, clean open-skill format, **evals** (quality tests), declarative-first philosophy. Weakness: only CAP; README does not enumerate skills.
- **secondsky/sap-skills** (community, GPL-3.0): broad but uneven. 40 plugins across BTP/ABAP/Fiori/HANA/SAC/CAP with rich tooling (commands, agents, hooks, MCP, LSP, marketplace, sync scripts). Weaknesses: **no evals**, content-verification concerns (some possibly unverified), version pins go stale, single maintainer, GPL-3.0 limits adoption.

**Goal:** a new repo that combines sap-skills' breadth with capire's quality bar, under a permissive license, portable across Claude Code and GitHub Copilot.

## 2. Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Broad SAP (~40 domains eventually), rebuilt to quality | User goal: breadth + quality |
| Unit | Full plugin: portable `SKILL.md` core + Claude-only `commands`/`agents`/`hooks`/`.mcp.json` + marketplace | Richest Claude UX while staying portable |
| License | **MIT**, written from scratch | Most permissive; **no text copied** from either source repo (sap-skills is GPL-3.0 — copying would force GPL) |
| Harnesses | Claude Code (CLI + VS Code) **and** GitHub Copilot (VS Code) | Portable `SKILL.md` core read by both; Claude layer ignored by Copilot |
| Quality gate | evals per skill + source-verification ledger + MCP-backed verification | The differentiator vs. plain breadth |
| Build order | Skeleton-first: foundation + one golden vertical slice (`sap-cap`), then replicate | Lowest risk, clearest template, immediately working output |
| Repo name | `sap-agent-skills` | Neutral, describes purpose |
| Delivery | Local, version-by-version git tags (`v0.1.0` foundation, `v0.2.0` CAP, …). Push to GitHub is a separate, user-authorized step | No GitHub auth available in this session |

**Non-goals (YAGNI):** we do not blindly clone all 40 sap-skills plugins. Low-value/ambiguous ones (e.g. `rpt1`, `sac-test-automation`, `intelligent-situation-automation`) are excluded unless later justified. No LSP wiring in Phase 1. No Codex/`.agents` catalog in Phase 1 (add later if needed).

## 3. Repository architecture

```
sap-agent-skills/
├─ .claude-plugin/marketplace.json        # Claude Code marketplace catalog (generated)
├─ .github/workflows/
│   ├─ validate.yml                        # schema + required-file lint
│   └─ evals.yml                           # run eval scenarios
├─ docs/
│   ├─ authoring-guide.md                  # how to build a plugin/skill
│   ├─ portability.md                      # Claude vs Copilot mapping
│   └─ verification-policy.md              # how content is verified + ledger rules
├─ schemas/
│   ├─ plugin.schema.json                  # validates each plugin.json
│   ├─ skill-frontmatter.schema.json       # validates SKILL.md frontmatter
│   └─ ledger.schema.json                  # validates ledger/sources.json
├─ ledger/sources.json                     # source-verification ledger
├─ scripts/
│   ├─ sync-manifests.mjs                  # regenerate marketplace + copilot manifests from plugins/
│   ├─ validate.mjs                        # frontmatter/plugin.json/ledger + required files
│   └─ run-evals.mjs                       # execute eval scenarios
├─ plugins/
│   └─ sap-cap/                            # first golden plugin (Phase 1)
│       ├─ .claude-plugin/plugin.json
│       ├─ commands/                       # /cap-init, /cap-troubleshoot, /cap-deploy-check
│       ├─ agents/                         # cap-service-developer, cap-cds-modeler
│       ├─ hooks/                          # post-edit cds compile lint
│       ├─ .mcp.json                       # wires @cap-js/mcp-server
│       └─ skills/sap-cap/
│           ├─ SKILL.md                    # portable core (open-skill frontmatter)
│           ├─ references/                 # nodejs, java, cdl, cql, annotations, deployment, security, multitenancy
│           ├─ templates/                  # data-model, service, ui-annotations, handler(js/ts), mta, xsuaa
│           └─ evals/                      # scenario files + rubric
├─ LICENSE                                 # MIT
├─ README.md
└─ package.json
```

## 4. Portability model

- **Portable heart:** `plugins/<domain>/skills/<name>/SKILL.md` in open-skill format — YAML frontmatter with at least `name`, `description`, `license`. Both Claude Code and VS Code Copilot consume this.
- **Claude-only layer:** `commands/`, `agents/`, `hooks/`, `.mcp.json`. Copilot ignores these — no breakage.
- **`sync-manifests.mjs`** is the single source of truth: it scans `plugins/` and regenerates the Claude `.claude-plugin/marketplace.json` and any Copilot-facing manifest, so manifests never drift from the plugin folders.
- **Install paths:** `npx skills add <repo>` (Copilot/OpenCode) and `/plugin marketplace add <repo>` (Claude Code) both work against the same tree.

## 5. Quality system

### 5.1 Evals
- Each skill has `evals/` containing scenario files: an input prompt plus expected-behavior assertions (a rubric).
- `run-evals.mjs` loads scenarios and checks them. Phase 1 target: scenarios are well-formed and machine-checkable (structural assertions such as "response recommends declarative CDS", "no hand-rolled OData boilerplate"). LLM-graded scoring is optional and can be layered later.
- CI job `evals.yml` runs the runner and fails on malformed or failing scenarios.

### 5.2 Source-verification ledger
- `ledger/sources.json` records, per plugin and per version-sensitive claim: the official SAP doc URL, the package name + verified version, the date verified, and the method (`mcp` | `manual`).
- `ledger.schema.json` validates the file; CI fails on schema violations.
- Purpose: prevent hallucinated APIs and make staleness auditable.

### 5.3 MCP-backed verification
- While authoring `sap-cap`, CAP APIs/patterns are checked against the live SAP CAP MCP server (`search_docs`, `search_model`) available in the environment; each verification produces a ledger entry with method `mcp`.

### 5.4 CI
- `validate.yml`: schema-validates every `plugin.json`, every `SKILL.md` frontmatter, and `ledger/sources.json`; checks required files exist per plugin.
- `evals.yml`: runs `run-evals.mjs`.

## 6. Golden slice — `plugins/sap-cap`

Written from scratch, MIT, verified against official CAP docs via MCP.

- **SKILL.md** — declarative-first CAP guidance for both Node.js and Java: runtime choice, MCP server usage, project setup rules, CDS modeling, declarative-vs-programmatic decision table, custom logic, sample data, anti-patterns. Defers detail to `references/`.
- **references/**: `nodejs.md`, `java.md`, `cdl.md`, `cql.md`, `annotations.md`, `deployment.md`, `security.md`, `multitenancy.md`.
- **templates/**: `data-model.cds`, `service.cds`, `ui-annotations.cds`, `handler.js`, `handler.ts`, `mta.yaml`, `xsuaa.json`.
- **commands/**: `/cap-init` (scaffold), `/cap-troubleshoot`, `/cap-deploy-check`.
- **agents/**: `cap-service-developer`, `cap-cds-modeler`.
- **hooks/**: post-edit hook running `cds compile` as a lint gate on `.cds` changes.
- **.mcp.json**: wires `@cap-js/mcp-server`.
- **evals/**: scenarios covering entity modeling (expects declarative CDS), adding custom logic (expects idiomatic handlers, no boilerplate), and deployment guidance.
- **ledger**: entries for `@sap/cds` and `@cap-js/mcp-server` pinned versions, each verified via MCP or official docs.

## 7. Phased roadmap (out of scope here)

- **Phase 1 (this spec):** foundation + `sap-cap` golden slice. Tags `v0.1.0` (foundation), `v0.2.0` (CAP).
- **Phase 2:** core dev — `sapui5`, `sap-fiori-tools`, `sap-abap`, `sap-abap-cds`.
- **Phase 3:** BTP platform — curated subset (deploy, connectivity, security, logging), not all 15.
- **Phase 4:** data & analytics — `hana-cli`, `hana-ml`, `datasphere`, `sac-*`.
- **Phase 5:** tooling — `api-style`, `dependency-security`, `browser-automation`.

Each domain reuses the golden template: copy structure → author verified content → add evals + ledger.

## 8. Success criteria (Phase 1)

1. `npm run validate` passes (schemas + required files).
2. `npm run evals` passes for `sap-cap`.
3. `sap-cap/skills/sap-cap/SKILL.md` is portable (valid open-skill frontmatter) and loads in both Claude Code and Copilot.
4. `sync-manifests.mjs` regenerates `marketplace.json` deterministically from `plugins/`.
5. Every version pin in `sap-cap` has a corresponding ledger entry.
6. Clean git history with `v0.1.0` and `v0.2.0` tags.
