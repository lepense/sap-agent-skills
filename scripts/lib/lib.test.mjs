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
