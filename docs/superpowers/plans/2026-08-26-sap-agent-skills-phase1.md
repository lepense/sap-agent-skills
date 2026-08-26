# sap-agent-skills Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the repository foundation (schemas, validation/sync/eval engine, CI, docs) and one complete "golden" plugin (`sap-cap`), proving the template that later phases replicate.

**Architecture:** Each SAP domain is a plugin under `plugins/<domain>/`. The portable heart is `skills/<name>/SKILL.md` (open-skill frontmatter, read by both Claude Code and GitHub Copilot). Claude-only extras (`commands/`, `agents/`, `hooks/`, `.mcp.json`) sit alongside and are ignored by Copilot. A zero-runtime-dependency Node engine validates structure, regenerates manifests from `plugins/`, and runs eval scenarios. A source-verification ledger records how version-sensitive claims were checked.

**Tech Stack:** Node.js ≥20 (ESM `.mjs`), devDependencies `ajv` + `ajv-formats` (JSON Schema), `yaml` (frontmatter). GitHub Actions for CI. Content: Markdown + CDS.

---

## File structure

**Foundation (v0.1.0)**
- `package.json` — scripts: `validate`, `sync`, `evals`; devDeps.
- `LICENSE` — MIT.
- `README.md` — purpose, install (Claude + Copilot), layout, contributing pointer.
- `.gitignore` — already exists.
- `schemas/plugin.schema.json` — validates each `plugin.json`.
- `schemas/skill-frontmatter.schema.json` — validates `SKILL.md` frontmatter.
- `schemas/ledger.schema.json` — validates `ledger/sources.json`.
- `ledger/sources.json` — starts empty (`{ "entries": [] }`).
- `.claude-plugin/marketplace.json` — generated; starts empty catalog.
- `scripts/lib/walk.mjs` — recursive file finder (no deps).
- `scripts/lib/frontmatter.mjs` — split YAML frontmatter from a `SKILL.md`.
- `scripts/validate.mjs` — schema + required-file checks.
- `scripts/sync-manifests.mjs` — regenerate `marketplace.json` from `plugins/`.
- `scripts/run-evals.mjs` — execute eval scenarios.
- `scripts/*.test.mjs` — node:test unit tests for the three scripts + libs.
- `.github/workflows/validate.yml`, `.github/workflows/evals.yml`.
- `docs/authoring-guide.md`, `docs/portability.md`, `docs/verification-policy.md`.
- `tests/fixtures/` — tiny valid/invalid plugin trees for script tests.

**Golden slice (v0.2.0)** under `plugins/sap-cap/`
- `.claude-plugin/plugin.json`
- `skills/sap-cap/SKILL.md` + `references/*.md` + `templates/*` + `evals/*.json`
- `commands/*.md`, `agents/*.md`, `hooks/hooks.json`, `.mcp.json`

---

## MILESTONE v0.1.0 — Foundation

### Task 1: Project manifest + license

**Files:**
- Create: `package.json`
- Create: `LICENSE`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "sap-agent-skills",
  "version": "0.1.0",
  "description": "Curated, verified SAP skills for AI coding agents (Claude Code + GitHub Copilot).",
  "type": "module",
  "license": "MIT",
  "engines": { "node": ">=20" },
  "scripts": {
    "validate": "node scripts/validate.mjs",
    "sync": "node scripts/sync-manifests.mjs",
    "evals": "node scripts/run-evals.mjs",
    "test": "node --test scripts/"
  },
  "devDependencies": {
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "yaml": "^2.5.1"
  }
}
```

- [ ] **Step 2: Write `LICENSE` (MIT)**

Standard MIT text, copyright line: `Copyright (c) 2026 sap-agent-skills contributors`.

- [ ] **Step 3: Install deps**

Run: `npm install`
Expected: creates `node_modules/` and `package-lock.json`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json LICENSE
git commit -m "chore: project manifest, MIT license, dev deps"
```

---

### Task 2: JSON schemas

**Files:**
- Create: `schemas/plugin.schema.json`
- Create: `schemas/skill-frontmatter.schema.json`
- Create: `schemas/ledger.schema.json`

- [ ] **Step 1: Write `schemas/plugin.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "plugin.schema.json",
  "type": "object",
  "required": ["name", "version", "description", "license"],
  "additionalProperties": true,
  "properties": {
    "name": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "description": { "type": "string", "minLength": 10 },
    "license": { "type": "string" },
    "author": { "type": "string" },
    "commands": { "type": "array", "items": { "type": "string" } },
    "agents": { "type": "array", "items": { "type": "string" } },
    "hooks": { "type": "string" },
    "mcpServers": { "type": "string" }
  }
}
```

- [ ] **Step 2: Write `schemas/skill-frontmatter.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "skill-frontmatter.schema.json",
  "type": "object",
  "required": ["name", "description", "license"],
  "additionalProperties": true,
  "properties": {
    "name": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "description": { "type": "string", "minLength": 20 },
    "license": { "type": "string" }
  }
}
```

- [ ] **Step 3: Write `schemas/ledger.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "ledger.schema.json",
  "type": "object",
  "required": ["entries"],
  "additionalProperties": false,
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["plugin", "claim", "source", "verifiedOn", "method"],
        "additionalProperties": false,
        "properties": {
          "plugin": { "type": "string" },
          "claim": { "type": "string" },
          "package": { "type": "string" },
          "version": { "type": "string" },
          "source": { "type": "string", "format": "uri" },
          "verifiedOn": { "type": "string", "format": "date" },
          "method": { "type": "string", "enum": ["mcp", "manual"] }
        }
      }
    }
  }
}
```

- [ ] **Step 4: Validate schemas are themselves parseable**

Run: `node -e "['plugin','skill-frontmatter','ledger'].forEach(s=>JSON.parse(require('fs').readFileSync('schemas/'+s+'.schema.json')))"`
Expected: exit 0, no output.

- [ ] **Step 5: Commit**

```bash
git add schemas/
git commit -m "feat: JSON schemas for plugin, skill frontmatter, ledger"
```

---

### Task 3: Shared libs (walk + frontmatter)

**Files:**
- Create: `scripts/lib/walk.mjs`
- Create: `scripts/lib/frontmatter.mjs`
- Create: `scripts/lib/lib.test.mjs`

- [ ] **Step 1: Write the failing test `scripts/lib/lib.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { walk } from "./walk.mjs";
import { parseFrontmatter } from "./frontmatter.mjs";

test("walk finds nested files", () => {
  const dir = mkdtempSync(join(tmpdir(), "walk-"));
  mkdirSync(join(dir, "a"));
  writeFileSync(join(dir, "a", "x.md"), "hi");
  writeFileSync(join(dir, "y.txt"), "yo");
  const found = walk(dir).map(p => p.replace(dir, "").replace(/\\/g, "/"));
  rmSync(dir, { recursive: true, force: true });
  assert.deepEqual(found.sort(), ["/a/x.md", "/y.txt"]);
});

test("parseFrontmatter splits yaml and body", () => {
  const { data, body } = parseFrontmatter("---\nname: sap-cap\n---\nHello");
  assert.equal(data.name, "sap-cap");
  assert.equal(body.trim(), "Hello");
});

test("parseFrontmatter returns null data when absent", () => {
  const { data } = parseFrontmatter("no frontmatter here");
  assert.equal(data, null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/`
Expected: FAIL — cannot find module `./walk.mjs`.

- [ ] **Step 3: Write `scripts/lib/walk.mjs`**

```js
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".git")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
```

- [ ] **Step 4: Write `scripts/lib/frontmatter.mjs`**

```js
import { parse } from "yaml";

export function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: null, body: text };
  return { data: parse(m[1]) ?? {}, body: m[2] };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test scripts/lib/`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/
git commit -m "feat: walk + frontmatter helper libs with tests"
```

---

### Task 4: `validate.mjs`

Validates every `plugin.json` against `plugin.schema.json`, every `SKILL.md` frontmatter against `skill-frontmatter.schema.json`, `ledger/sources.json` against `ledger.schema.json`, and that each plugin has a `skills/<name>/SKILL.md`.

**Files:**
- Create: `scripts/validate.mjs`
- Create: `scripts/validate.test.mjs`
- Create: `tests/fixtures/good/plugins/demo/.claude-plugin/plugin.json`
- Create: `tests/fixtures/good/plugins/demo/skills/demo/SKILL.md`
- Create: `tests/fixtures/good/ledger/sources.json`
- Create: `tests/fixtures/bad/plugins/demo/.claude-plugin/plugin.json`

- [ ] **Step 1: Create fixtures**

`tests/fixtures/good/plugins/demo/.claude-plugin/plugin.json`:
```json
{ "name": "demo", "version": "0.1.0", "description": "A demo plugin for tests.", "license": "MIT" }
```
`tests/fixtures/good/plugins/demo/skills/demo/SKILL.md`:
```markdown
---
name: demo
description: A demo skill used only by the validator unit tests.
license: MIT
---
Body.
```
`tests/fixtures/good/ledger/sources.json`:
```json
{ "entries": [] }
```
`tests/fixtures/bad/plugins/demo/.claude-plugin/plugin.json` (missing `license`, bad version):
```json
{ "name": "Demo", "version": "1", "description": "short" }
```

- [ ] **Step 2: Write failing test `scripts/validate.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateRepo } from "./validate.mjs";

test("good fixture passes", () => {
  const errors = validateRepo("tests/fixtures/good");
  assert.deepEqual(errors, []);
});

test("bad fixture reports errors", () => {
  const errors = validateRepo("tests/fixtures/bad");
  assert.ok(errors.length >= 1);
  assert.ok(errors.join("\n").includes("plugin.json"));
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test scripts/validate.test.mjs`
Expected: FAIL — `validateRepo` not exported.

- [ ] **Step 4: Write `scripts/validate.mjs`**

```js
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { walk } from "./lib/walk.mjs";
import { parseFrontmatter } from "./lib/frontmatter.mjs";

const ajv = addFormats(new Ajv({ allErrors: true }));
const schema = (n) => JSON.parse(readFileSync(join("schemas", n + ".schema.json")));
const vPlugin = ajv.compile(schema("plugin"));
const vSkill = ajv.compile(schema("skill-frontmatter"));
const vLedger = ajv.compile(schema("ledger"));

export function validateRepo(root) {
  const errors = [];
  const files = existsSync(root) ? walk(root) : [];

  for (const f of files.filter(p => p.replace(/\\/g, "/").endsWith("/.claude-plugin/plugin.json"))) {
    const data = JSON.parse(readFileSync(f, "utf8"));
    if (!vPlugin(data)) errors.push(`${f} (plugin.json): ` + ajv.errorsText(vPlugin.errors));
    // required: a SKILL.md exists under the plugin
    const pluginRoot = dirname(dirname(f));
    const hasSkill = walk(pluginRoot).some(p => p.replace(/\\/g, "/").endsWith("/SKILL.md"));
    if (!hasSkill) errors.push(`${pluginRoot}: no SKILL.md found`);
  }

  for (const f of files.filter(p => p.replace(/\\/g, "/").endsWith("/SKILL.md"))) {
    const { data } = parseFrontmatter(readFileSync(f, "utf8"));
    if (!data) { errors.push(`${f}: missing frontmatter`); continue; }
    if (!vSkill(data)) errors.push(`${f} (frontmatter): ` + ajv.errorsText(vSkill.errors));
  }

  const ledgerPath = join(root, "ledger", "sources.json");
  if (existsSync(ledgerPath)) {
    const data = JSON.parse(readFileSync(ledgerPath, "utf8"));
    if (!vLedger(data)) errors.push(`${ledgerPath}: ` + ajv.errorsText(vLedger.errors));
  }
  return errors;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("validate.mjs")) {
  const errors = validateRepo(".");
  if (errors.length) { console.error("VALIDATION FAILED:\n" + errors.map(e => " - " + e).join("\n")); process.exit(1); }
  console.log("Validation passed.");
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test scripts/validate.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 6: Run the CLI against the repo (should pass — no plugins yet)**

Run: `npm run validate`
Expected: "Validation passed." (ledger not present yet is fine; add it in Task 7).

- [ ] **Step 7: Commit**

```bash
git add scripts/validate.mjs scripts/validate.test.mjs tests/fixtures/
git commit -m "feat: repo validator (plugin.json, SKILL.md frontmatter, ledger)"
```

---

### Task 5: `sync-manifests.mjs`

Scans `plugins/*/.claude-plugin/plugin.json` and writes `.claude-plugin/marketplace.json` deterministically (sorted by name).

**Files:**
- Create: `scripts/sync-manifests.mjs`
- Create: `scripts/sync-manifests.test.mjs`

- [ ] **Step 1: Write failing test `scripts/sync-manifests.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMarketplace } from "./sync-manifests.mjs";

test("builds sorted marketplace from fixture", () => {
  const mp = buildMarketplace("tests/fixtures/good");
  assert.equal(mp.name, "sap-agent-skills");
  assert.equal(mp.plugins.length, 1);
  assert.equal(mp.plugins[0].name, "demo");
  assert.equal(mp.plugins[0].source, "./plugins/demo");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/sync-manifests.test.mjs`
Expected: FAIL — `buildMarketplace` not exported.

- [ ] **Step 3: Write `scripts/sync-manifests.mjs`**

```js
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { walk } from "./lib/walk.mjs";

export function buildMarketplace(root) {
  const pluginFiles = (existsSync(join(root, "plugins")) ? walk(join(root, "plugins")) : [])
    .filter(p => p.replace(/\\/g, "/").endsWith("/.claude-plugin/plugin.json"));
  const plugins = pluginFiles.map(f => {
    const d = JSON.parse(readFileSync(f, "utf8"));
    return { name: d.name, description: d.description, version: d.version, source: `./plugins/${d.name}` };
  }).sort((a, b) => a.name.localeCompare(b.name));
  return { name: "sap-agent-skills", owner: { name: "sap-agent-skills contributors" }, plugins };
}

if (process.argv[1]?.endsWith("sync-manifests.mjs")) {
  const mp = buildMarketplace(".");
  writeFileSync(".claude-plugin/marketplace.json", JSON.stringify(mp, null, 2) + "\n");
  console.log(`Wrote .claude-plugin/marketplace.json (${mp.plugins.length} plugin(s)).`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/sync-manifests.test.mjs`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add scripts/sync-manifests.mjs scripts/sync-manifests.test.mjs
git commit -m "feat: sync-manifests regenerates marketplace.json from plugins/"
```

---

### Task 6: `run-evals.mjs`

Eval scenario = JSON file under a skill's `evals/`. Shape:
```json
{ "name": "...", "prompt": "...", "assert": { "mustInclude": ["..."], "mustNotInclude": ["..."] }, "against": "SKILL.md" }
```
Phase-1 runner is a **static rubric check**: it loads the referenced skill file(s) and asserts the guidance text contains `mustInclude` phrases and omits `mustNotInclude` phrases. (LLM-graded scoring is a later enhancement.) This guarantees the skill actually documents the behavior the scenario expects.

**Files:**
- Create: `scripts/run-evals.mjs`
- Create: `scripts/run-evals.test.mjs`
- Create: `tests/fixtures/good/plugins/demo/skills/demo/evals/basic.json`

- [ ] **Step 1: Create fixture eval `tests/fixtures/good/plugins/demo/skills/demo/evals/basic.json`**

```json
{ "name": "mentions body", "against": "SKILL.md", "assert": { "mustInclude": ["Body"], "mustNotInclude": ["FORBIDDEN"] } }
```

- [ ] **Step 2: Write failing test `scripts/run-evals.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { runEvals } from "./run-evals.mjs";

test("passing eval reports zero failures", () => {
  const { failures, total } = runEvals("tests/fixtures/good");
  assert.equal(total, 1);
  assert.deepEqual(failures, []);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test scripts/run-evals.test.mjs`
Expected: FAIL — `runEvals` not exported.

- [ ] **Step 4: Write `scripts/run-evals.mjs`**

```js
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { walk } from "./lib/walk.mjs";

export function runEvals(root) {
  const evalFiles = (existsSync(join(root, "plugins")) ? walk(join(root, "plugins")) : [])
    .filter(p => { const u = p.replace(/\\/g, "/"); return u.includes("/evals/") && u.endsWith(".json"); });
  const failures = [];
  let total = 0;
  for (const f of evalFiles) {
    total++;
    const spec = JSON.parse(readFileSync(f, "utf8"));
    const skillDir = dirname(dirname(f)); // evals/.. -> skill dir
    const target = join(skillDir, spec.against ?? "SKILL.md");
    if (!existsSync(target)) { failures.push(`${f}: target ${spec.against} not found`); continue; }
    const text = readFileSync(target, "utf8");
    for (const s of spec.assert?.mustInclude ?? [])
      if (!text.includes(s)) failures.push(`${f}: expected to include "${s}"`);
    for (const s of spec.assert?.mustNotInclude ?? [])
      if (text.includes(s)) failures.push(`${f}: expected to NOT include "${s}"`);
  }
  return { failures, total };
}

if (process.argv[1]?.endsWith("run-evals.mjs")) {
  const { failures, total } = runEvals(".");
  if (failures.length) { console.error(`EVALS FAILED (${failures.length}/${total}):\n` + failures.map(e => " - " + e).join("\n")); process.exit(1); }
  console.log(`Evals passed (${total}).`);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test scripts/run-evals.test.mjs`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add scripts/run-evals.mjs scripts/run-evals.test.mjs tests/fixtures/good/plugins/demo/skills/demo/evals/basic.json
git commit -m "feat: static-rubric eval runner"
```

---

### Task 7: Ledger, empty marketplace, CI, docs, README

**Files:**
- Create: `ledger/sources.json`
- Create: `.claude-plugin/marketplace.json` (via `npm run sync`)
- Create: `.github/workflows/validate.yml`
- Create: `.github/workflows/evals.yml`
- Create: `docs/authoring-guide.md`, `docs/portability.md`, `docs/verification-policy.md`
- Create: `README.md`

- [ ] **Step 1: Create `ledger/sources.json`**

```json
{ "entries": [] }
```

- [ ] **Step 2: Generate the empty marketplace**

Run: `npm run sync`
Expected: "Wrote .claude-plugin/marketplace.json (0 plugin(s))."

- [ ] **Step 3: Write `.github/workflows/validate.yml`**

```yaml
name: validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm test
      - run: npm run validate
      - run: node scripts/sync-manifests.mjs && git diff --exit-code .claude-plugin/marketplace.json
```

- [ ] **Step 4: Write `.github/workflows/evals.yml`**

```yaml
name: evals
on: [push, pull_request]
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm run evals
```

- [ ] **Step 5: Write the three docs**

- `docs/portability.md`: table mapping each artifact to Claude Code vs GitHub Copilot (SKILL.md = both; commands/agents/hooks/.mcp.json = Claude only; how each tool discovers skills; `npx skills add` vs `/plugin marketplace add`).
- `docs/verification-policy.md`: every version-sensitive claim needs a `ledger/sources.json` entry; allowed `method` values (`mcp`, `manual`); how to verify CAP content via the SAP CAP MCP server; quarterly re-verification note.
- `docs/authoring-guide.md`: how to add a plugin — folder layout, required `plugin.json` + `SKILL.md` frontmatter fields, add `evals/`, add ledger entries, run `npm run validate && npm run evals && npm run sync`.

- [ ] **Step 6: Write `README.md`**

Sections: what it is; supported tools (Claude Code CLI + VS Code, GitHub Copilot in VS Code); install for each; repo layout; quality model (evals + ledger + MCP verification); how to contribute (link authoring-guide); license (MIT). Enumerate available plugins (initially: `sap-cap` after v0.2.0).

- [ ] **Step 7: Full validation gate**

Run: `npm test && npm run validate && npm run evals`
Expected: all pass; validate prints "Validation passed."; evals prints "Evals passed (0)." (no plugin evals yet).

- [ ] **Step 8: Commit and tag v0.1.0**

```bash
git add ledger .claude-plugin .github docs README.md
git commit -m "feat: ledger, CI workflows, docs, README (foundation)"
git tag v0.1.0
```

---

## MILESTONE v0.2.0 — `sap-cap` golden slice

> All CAP content is authored fresh (MIT) and version-sensitive claims verified against official CAP docs via the SAP CAP MCP server (`search_docs`/`search_model`), each recorded in `ledger/sources.json` with `method: "mcp"`.

### Task 8: Plugin manifest + skill frontmatter scaffold

**Files:**
- Create: `plugins/sap-cap/.claude-plugin/plugin.json`
- Create: `plugins/sap-cap/skills/sap-cap/SKILL.md` (frontmatter + headings only first)

- [ ] **Step 1: Write `plugins/sap-cap/.claude-plugin/plugin.json`**

```json
{
  "name": "sap-cap",
  "version": "0.2.0",
  "description": "Expert guidance for building and extending SAP CAP (Cloud Application Programming Model) applications in Node.js or Java, declarative-first.",
  "license": "MIT",
  "author": "sap-agent-skills contributors",
  "commands": ["commands/cap-init.md", "commands/cap-troubleshoot.md", "commands/cap-deploy-check.md"],
  "agents": ["agents/cap-service-developer.md", "agents/cap-cds-modeler.md"],
  "hooks": "hooks/hooks.json",
  "mcpServers": ".mcp.json"
}
```

- [ ] **Step 2: Write `SKILL.md` frontmatter + section skeleton**

```markdown
---
name: sap-cap
description: Build and extend SAP CAP applications (Node.js or Java) using a declarative-first approach with CDS, OData, and Fiori elements.
license: MIT
---

# SAP CAP developer

## What this covers
## Runtime choice (Node.js vs Java)
## Using the CAP MCP server
## Project setup rules
## CDS modeling
## Declarative first (decision table)
## Programmatic custom logic
## Sample data
## Anti-patterns (Don't)
## References
```

- [ ] **Step 3: Validate frontmatter**

Run: `npm run validate`
Expected: "Validation passed." (SKILL.md exists under the plugin, frontmatter valid).

- [ ] **Step 4: Commit**

```bash
git add plugins/sap-cap/.claude-plugin/plugin.json plugins/sap-cap/skills/sap-cap/SKILL.md
git commit -m "feat(sap-cap): plugin manifest + skill skeleton"
```

---

### Task 9: Author SKILL.md body (MCP-verified)

**Files:**
- Modify: `plugins/sap-cap/skills/sap-cap/SKILL.md`

- [ ] **Step 1: Verify core facts via MCP before writing**

Use `mcp__SAP_CAP_MCP_Server__search_docs` for: current `cds init`/`cds add`/`cds watch` usage; declarative-first annotations; Node.js vs Java parity. Note findings for the ledger (Task 16).

- [ ] **Step 2: Fill each section** (concrete requirements — no placeholder text in final file):
  - **What this covers:** one paragraph; defer detail to `references/`.
  - **Runtime choice:** when Node.js vs Java; keep principles unified.
  - **CAP MCP server:** instruct the agent to consult the MCP server for API/doc lookups instead of guessing.
  - **Project setup rules:** `cds init`, `cds add <facet>`, `cds watch`; folder conventions (`db/`, `srv/`, `app/`).
  - **CDS modeling:** entities/aspects/associations; keep models lean.
  - **Declarative first:** a markdown decision table — annotation-driven vs custom handler; prefer annotations.
  - **Programmatic custom logic:** idiomatic handlers; link `references/nodejs.md` and `references/java.md`.
  - **Sample data:** CSV in `db/data/`.
  - **Anti-patterns:** list (hand-rolled OData boilerplate, bypassing CDS, hardcoding auth, etc.).
  - **References:** relative links to every file in `references/`.

- [ ] **Step 3: Validate**

Run: `npm run validate`
Expected: "Validation passed."

- [ ] **Step 4: Commit**

```bash
git add plugins/sap-cap/skills/sap-cap/SKILL.md
git commit -m "docs(sap-cap): author declarative-first SKILL.md body (MCP-verified)"
```

---

### Task 10: reference files

**Files:**
- Create: `plugins/sap-cap/skills/sap-cap/references/{nodejs,java,cdl,cql,annotations,deployment,security,multitenancy}.md`

- [ ] **Step 1: Write each reference** (each a focused doc, MCP-verified where version-sensitive):
  - `nodejs.md`: service handlers, `srv` implementation, `cds.ql`, events.
  - `java.md`: CAP Java handlers, `@On/@Before/@After`, CQN.
  - `cdl.md`: CDS Definition Language essentials.
  - `cql.md`: CDS Query Language (SELECT/INSERT/UPSERT patterns).
  - `annotations.md`: common `@` annotations incl. Fiori UI + `@readonly/@mandatory`.
  - `deployment.md`: `cds add mta`, Cloud Foundry / Kyma, HANA vs SQLite.
  - `security.md`: XSUAA, `@requires`/`@restrict`, roles.
  - `multitenancy.md`: `cds add multitenancy`, tenant isolation basics.

- [ ] **Step 2: Validate + commit**

Run: `npm run validate`
```bash
git add plugins/sap-cap/skills/sap-cap/references/
git commit -m "docs(sap-cap): reference docs (nodejs, java, cdl, cql, annotations, deployment, security, multitenancy)"
```

---

### Task 11: templates

**Files:**
- Create: `plugins/sap-cap/skills/sap-cap/templates/{data-model.cds,service.cds,ui-annotations.cds,handler.js,handler.ts,mta.yaml,xsuaa.json}`

- [ ] **Step 1: Write each template** as a minimal, valid, copy-pasteable starting point consistent with the SKILL.md guidance (declarative-first). `data-model.cds` with an entity + aspect; `service.cds` projecting it; `ui-annotations.cds` with a `UI.LineItem`; `handler.js`/`handler.ts` with a single `@After` handler example; `mta.yaml` minimal CAP MTA; `xsuaa.json` minimal security descriptor.

- [ ] **Step 2: Commit**

```bash
git add plugins/sap-cap/skills/sap-cap/templates/
git commit -m "feat(sap-cap): starter templates (data model, service, UI, handlers, mta, xsuaa)"
```

---

### Task 12: commands

**Files:**
- Create: `plugins/sap-cap/commands/{cap-init,cap-troubleshoot,cap-deploy-check}.md`

- [ ] **Step 1: Write each command** as a Claude Code slash-command markdown file (frontmatter `description`, then instructions):
  - `cap-init.md`: scaffold a new CAP project (runtime prompt, `cds init`, add facets, sample data).
  - `cap-troubleshoot.md`: diagnose common CAP errors (build/deploy/auth), consult MCP.
  - `cap-deploy-check.md`: pre-deploy checklist (mta build, HANA binding, XSUAA, `cds build`).

- [ ] **Step 2: Commit**

```bash
git add plugins/sap-cap/commands/
git commit -m "feat(sap-cap): slash commands (init, troubleshoot, deploy-check)"
```

---

### Task 13: agents

**Files:**
- Create: `plugins/sap-cap/agents/{cap-service-developer,cap-cds-modeler}.md`

- [ ] **Step 1: Write each agent** with frontmatter (`name`, `description`, `tools`) + system prompt:
  - `cap-service-developer.md`: implements services/handlers idiomatically, declarative-first, verifies via MCP.
  - `cap-cds-modeler.md`: designs CDS data models (entities, aspects, associations, annotations).

- [ ] **Step 2: Commit**

```bash
git add plugins/sap-cap/agents/
git commit -m "feat(sap-cap): agents (service-developer, cds-modeler)"
```

---

### Task 14: hooks + MCP wiring

**Files:**
- Create: `plugins/sap-cap/hooks/hooks.json`
- Create: `plugins/sap-cap/.mcp.json`

- [ ] **Step 1: Write `hooks/hooks.json`** — a PostToolUse hook on Edit/Write of `*.cds` that runs `cds compile` as a lint gate (non-blocking warning if `cds` absent).

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash -c 'command -v cds >/dev/null && git ls-files -m 2>/dev/null | grep -q \\.cds$ && cds compile \"*\" >/dev/null 2>&1 || true'" }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Write `.mcp.json`** wiring the CAP MCP server:

```json
{
  "mcpServers": {
    "cap": { "command": "npx", "args": ["-y", "@cap-js/mcp-server"] }
  }
}
```

- [ ] **Step 3: Validate + commit**

Run: `npm run validate`
```bash
git add plugins/sap-cap/hooks plugins/sap-cap/.mcp.json
git commit -m "feat(sap-cap): cds-compile hook + CAP MCP server wiring"
```

---

### Task 15: evals

**Files:**
- Create: `plugins/sap-cap/skills/sap-cap/evals/{declarative-first,custom-logic,deployment}.json`

- [ ] **Step 1: Write eval scenarios** (static-rubric against `SKILL.md`; phrases must match text actually present after Task 9):
  - `declarative-first.json`: `mustInclude` = ["Declarative first", "annotation"]; `mustNotInclude` = ["hand-rolled OData"] present only in anti-pattern context → instead assert `mustInclude` ["Anti-patterns"].
  - `custom-logic.json`: `mustInclude` = ["custom logic", "references/nodejs.md"].
  - `deployment.json`: `mustInclude` = ["cds add mta"] and `against`: `references/deployment.md`.

Example `declarative-first.json`:
```json
{ "name": "declarative-first guidance present", "against": "SKILL.md",
  "assert": { "mustInclude": ["Declarative first", "annotation", "Anti-patterns"] } }
```

- [ ] **Step 2: Run evals**

Run: `npm run evals`
Expected: "Evals passed (3)." — if a phrase is missing, fix the SKILL.md wording or the scenario until aligned.

- [ ] **Step 3: Commit**

```bash
git add plugins/sap-cap/skills/sap-cap/evals/
git commit -m "test(sap-cap): eval scenarios (declarative-first, custom-logic, deployment)"
```

---

### Task 16: ledger entries

**Files:**
- Modify: `ledger/sources.json`

- [ ] **Step 1: Add entries** for each version-sensitive claim gathered in Tasks 9–14. Minimum: `@sap/cds` version and `@cap-js/mcp-server` version, each with the official doc/npm source URL, `verifiedOn: 2026-08-26`, `method: mcp` (or `manual` if verified from npm/docs directly).

Example entry:
```json
{ "plugin": "sap-cap", "claim": "@sap/cds current major supports declarative-first CDS + cds add facets",
  "package": "@sap/cds", "version": "<verified>", "source": "https://cap.cloud.sap/docs/",
  "verifiedOn": "2026-08-26", "method": "mcp" }
```

- [ ] **Step 2: Validate ledger**

Run: `npm run validate`
Expected: "Validation passed." (ledger matches schema).

- [ ] **Step 3: Commit**

```bash
git add ledger/sources.json
git commit -m "chore(sap-cap): source-verification ledger entries"
```

---

### Task 17: sync, final gate, tag v0.2.0

- [ ] **Step 1: Regenerate marketplace**

Run: `npm run sync`
Expected: "Wrote .claude-plugin/marketplace.json (1 plugin(s))." containing `sap-cap`.

- [ ] **Step 2: Full gate**

Run: `npm test && npm run validate && npm run evals`
Expected: all pass; evals "Evals passed (3)." (fixture eval under tests/fixtures is not scanned — runner scans only `plugins/`).

- [ ] **Step 3: Update README plugin list** to include `sap-cap`.

- [ ] **Step 4: Commit and tag**

```bash
git add .claude-plugin/marketplace.json README.md
git commit -m "feat: register sap-cap in marketplace; release v0.2.0"
git tag v0.2.0
```

---

## Self-review notes

- **Spec coverage:** §3 layout → Tasks 1–7,8–17; §4 portability → docs (Task 7) + plugin structure; §5 quality (evals/ledger/MCP/CI) → Tasks 4,6,7,15,16; §6 golden slice → Tasks 8–17; §8 success criteria → validate/evals/sync gates + tags. Covered.
- **Placeholders:** script/schema tasks contain full code; content tasks specify exact files, required sections, and the validation/eval gate that proves completion (content is authored + MCP-verified at execution time — its correctness is enforced by evals + ledger, not pre-written prose).
- **Type consistency:** exported names used consistently — `validateRepo`, `buildMarketplace`, `runEvals`, `walk`, `parseFrontmatter`. Runner scans only `plugins/` (fixtures live under `tests/`), so Task 17's "Evals passed (3)" is correct.

## Post-Phase-1

Later phases (Phase 2 `sapui5`/`fiori`/`abap`, etc.) each get their own spec → plan, reusing `plugins/sap-cap/` as the template. GitHub push (user-authorized) can happen after any tag.
