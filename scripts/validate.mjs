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

const u = (p) => p.replace(/\\/g, "/");

export function validateRepo(root) {
  const errors = [];
  const pluginsDir = join(root, "plugins");
  const files = existsSync(pluginsDir) ? walk(pluginsDir) : [];

  for (const f of files.filter((p) => u(p).endsWith("/.claude-plugin/plugin.json"))) {
    const data = JSON.parse(readFileSync(f, "utf8"));
    if (!vPlugin(data)) errors.push(`${u(f)} (plugin.json): ` + ajv.errorsText(vPlugin.errors));
    const pluginRoot = dirname(dirname(f));
    const hasSkill = walk(pluginRoot).some((p) => u(p).endsWith("/SKILL.md"));
    if (!hasSkill) errors.push(`${u(pluginRoot)}: no SKILL.md found`);
  }

  for (const f of files.filter((p) => u(p).endsWith("/SKILL.md"))) {
    const { data } = parseFrontmatter(readFileSync(f, "utf8"));
    if (!data) {
      errors.push(`${u(f)}: missing frontmatter`);
      continue;
    }
    if (!vSkill(data)) errors.push(`${u(f)} (frontmatter): ` + ajv.errorsText(vSkill.errors));
  }

  const ledgerPath = join(root, "ledger", "sources.json");
  if (existsSync(ledgerPath)) {
    const data = JSON.parse(readFileSync(ledgerPath, "utf8"));
    if (!vLedger(data)) errors.push(`${u(ledgerPath)}: ` + ajv.errorsText(vLedger.errors));
  }
  return errors;
}

if (process.argv[1] && u(process.argv[1]).endsWith("validate.mjs")) {
  const errors = validateRepo(".");
  if (errors.length) {
    console.error("VALIDATION FAILED:\n" + errors.map((e) => " - " + e).join("\n"));
    process.exit(1);
  }
  console.log("Validation passed.");
}
