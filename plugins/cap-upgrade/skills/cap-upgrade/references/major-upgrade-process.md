# Major-release upgrade process

A repeatable, low-risk sequence for moving a CAP project across a major (e.g. CDS 9 → 10).

## Steps

1. **Read the migration guide** and release notes for the target major. List the breaking
   changes that touch your project (removed APIs, changed defaults, config renames).
2. **Baseline:** clean working tree, green test suite on the current version, and record
   current versions (`cds version`, `npm ls @sap/cds`).
3. **Runtime first:** raise Node.js/JDK to the new minimum locally, in CI, and for deploy;
   confirm the app still starts on the current CAP version.
4. **Bump CAP:** update `@sap/cds` (+ `@sap/cds-dk` and CAP plugins) to the target major in
   `package.json`; `npm install` (regenerate the lockfile).
5. **Run `cds upgrade`:** address every finding; adjust model/config/code in small commits.
6. **Build & test:** `cds build` and run the **full** suite (`npm test`); fix each breakage.
   Pay attention to changed defaults (auth, DB, OData behavior).
7. **Hybrid verify:** run against real HANA/XSUAA (`cds bind` + `--profile hybrid`) to catch
   platform-level differences.
8. **Deploy to a test space/namespace**, smoke-test, then promote.

## Rollback

Keep the change on a branch; if a blocking issue appears, revert the version bump (lockfile
included) and re-plan. Small, reviewable commits make partial rollback easy.

## Guidance

Runtime first, then CAP, then `cds upgrade`, then tests, then hybrid, then deploy. Never skip
the migration guide or ship without a green regression run.
