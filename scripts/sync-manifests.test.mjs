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
