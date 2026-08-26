import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { walk } from "./lib/walk.mjs";

const u = (p) => p.replace(/\\/g, "/");

export function buildMarketplace(root) {
  const pluginsDir = join(root, "plugins");
  const pluginFiles = (existsSync(pluginsDir) ? walk(pluginsDir) : []).filter((p) =>
    u(p).endsWith("/.claude-plugin/plugin.json")
  );
  const plugins = pluginFiles
    .map((f) => {
      const d = JSON.parse(readFileSync(f, "utf8"));
      return { name: d.name, description: d.description, version: d.version, source: `./plugins/${d.name}` };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return { name: "sap-agent-skills", owner: { name: "sap-agent-skills contributors" }, plugins };
}

if (process.argv[1] && u(process.argv[1]).endsWith("sync-manifests.mjs")) {
  const mp = buildMarketplace(".");
  writeFileSync(".claude-plugin/marketplace.json", JSON.stringify(mp, null, 2) + "\n");
  console.log(`Wrote .claude-plugin/marketplace.json (${mp.plugins.length} plugin(s)).`);
}
