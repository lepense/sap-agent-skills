import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { walk } from "./lib/walk.mjs";

const u = (p) => p.replace(/\\/g, "/");

export function runEvals(root) {
  const pluginsDir = join(root, "plugins");
  const evalFiles = (existsSync(pluginsDir) ? walk(pluginsDir) : []).filter((p) => {
    const s = u(p);
    return s.includes("/evals/") && s.endsWith(".json");
  });
  const failures = [];
  let total = 0;
  for (const f of evalFiles) {
    total++;
    const spec = JSON.parse(readFileSync(f, "utf8"));
    const skillDir = dirname(dirname(f)); // evals/<file> -> skill dir
    const target = join(skillDir, spec.against ?? "SKILL.md");
    if (!existsSync(target)) {
      failures.push(`${u(f)}: target ${spec.against} not found`);
      continue;
    }
    const text = readFileSync(target, "utf8");
    for (const s of spec.assert?.mustInclude ?? [])
      if (!text.includes(s)) failures.push(`${u(f)}: expected to include "${s}"`);
    for (const s of spec.assert?.mustNotInclude ?? [])
      if (text.includes(s)) failures.push(`${u(f)}: expected to NOT include "${s}"`);
  }
  return { failures, total };
}

if (process.argv[1] && u(process.argv[1]).endsWith("run-evals.mjs")) {
  const { failures, total } = runEvals(".");
  if (failures.length) {
    console.error(`EVALS FAILED (${failures.length}/${total}):\n` + failures.map((e) => " - " + e).join("\n"));
    process.exit(1);
  }
  console.log(`Evals passed (${total}).`);
}
