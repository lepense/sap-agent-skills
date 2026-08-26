import { test } from "node:test";
import assert from "node:assert/strict";
import { runEvals } from "./run-evals.mjs";

test("passing eval reports zero failures", () => {
  const { failures, total } = runEvals("tests/fixtures/good");
  assert.equal(total, 1);
  assert.deepEqual(failures, []);
});
