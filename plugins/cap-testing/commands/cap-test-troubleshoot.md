---
description: Diagnose and fix failing or flaky CAP tests.
---

Diagnose CAP test problems methodically:

1. **Harness/startup:** `cds.test(dir)` must point at the project root (folder with the CAP
   model / package.json). A wrong path or model error prevents the server from starting — read
   the deploy log.
2. **No/incorrect data:** the in-memory DB is seeded from CSVs; a missing/misnamed CSV
   (`<namespace>-<Entity>.csv`) or a test depending on data another test changed causes
   failures. Insert focused data per test for isolation.
3. **Auth failures:** 401 where you expected 200 → missing `{ auth: {...} }` or the mock user
   isn't configured; 403 → the user lacks the role. Verify `cds.requires.auth` mock users.
4. **Chai / runner interop:** under **Jest**, Chai-6-ESM can misbehave (e.g. `.chai` access).
   Prefer `node --test` or `mocha`, or import `chai` directly.
5. **Flaky / order-dependent:** tests must pass in isolation — remove shared mutable state,
   reset data in `beforeEach`, and avoid relying on execution order.
6. **Cloud-bound tests failing locally:** they need real bindings — run via
   `cds bind --exec -- node --test`, and keep them in an opt-in job.

Reproduce the single failing test, apply the minimal fix, and re-run the whole suite to
confirm nothing else regressed.
