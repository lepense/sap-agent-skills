---
description: Diagnose and fix breakages introduced by a CAP version upgrade.
---

Diagnose failures that appear after bumping CAP versions. Steps:

1. **Confirm the runtime baseline:** does the app start at all? A crash on boot after an upgrade
   is often a **Node.js/JDK** mismatch (e.g. CDS 10 needs Node 22+). Fix the runtime first.
2. **Build errors (`cds build`):** removed/renamed config keys (`cds.requires.*`), changed
   facet behavior, or model constructs deprecated in the new major. Cross-check the migration
   guide and `cds upgrade` findings.
3. **Runtime/handler errors:** changed handler signatures or event names; adjust custom logic to
   the new API. Search the migration guide for the specific symbol.
4. **Behavioral diffs (tests fail, no error):** changed **defaults** — auth strategy, database,
   OData version/pagination, CQN result shapes. Assert on data and update expectations to the
   intended new behavior (don't just silence the test).
5. **Auth/deploy:** regenerate `xs-security.json` (`cds compile --to xsuaa`); rebuild artifacts
   (`gen/`).
6. **Version drift:** `npm ls @sap/cds` — a transitive dependency may pin an old runtime;
   dedupe/override as needed.
7. **Isolate:** reproduce on a clean install (`rm -rf node_modules && npm ci`) and in a hybrid
   run to separate app bugs from platform differences.

Fix each finding in a small commit, re-run `cds build` + the full test suite, and confirm a
hybrid run before deploying. If a blocker persists, revert the version bump (with lockfile) and
re-plan.
