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
