---
description: Upgrade a CAP project to a newer major (e.g. CDS 10) safely.
---

Drive a CAP major upgrade for the user. Steps:

1. **Read the migration guide** for the target major; list the breaking changes that touch this
   project.
2. **Baseline:** clean working tree, `npm test` green on the current version; record versions
   (`cds version`, `npm ls @sap/cds`).
3. **Runtime first:** raise Node.js/JDK to the new minimum in local, CI (`setup-node`), and
   deploy config. For CDS 10, Node.js 22+ (24 recommended); set `"engines": { "node": ">=22" }`.
   Confirm the app still starts on the current CAP version.
4. **Bump CAP:** update `@sap/cds` (+ `@sap/cds-dk`, `@cap-js/*`) to the target major in
   `package.json`; `npm install` to refresh the lockfile. See `templates/package-pin.json`.
5. **Run `cds upgrade`** (`npm i -g @sap/cds-dk` first); address each finding in small commits.
6. **Build & test:** `cds build --production` then the full suite (`npm test` / `mvn test`);
   fix breakages, watching changed defaults (auth/DB/OData). Regenerate `xs-security.json` if
   auth changed.
7. **Hybrid verify** against real HANA/XSUAA, then deploy to a test space and smoke-test.
8. **Record it:** update CHANGELOG and tag.

Use `templates/upgrade-checklist.md`. Never skip the migration guide or ship without a green
regression run.
