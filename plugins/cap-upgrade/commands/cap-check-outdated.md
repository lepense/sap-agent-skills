---
description: Audit a CAP project's dependency versions and plan updates.
---

Review the user's CAP dependency health and propose a plan. Steps:

1. **Inspect versions:** `cds version`, `npm ls @sap/cds` (resolved runtime), `npm outdated`
   (available updates), `node -v` / JDK version.
2. **Classify updates:**
   - **Patch/minor** of `@sap/cds`, `@sap/cds-dk`, `@cap-js/*`, and other deps → safe to bump
     once CI is green.
   - **Major** of `@sap/cds` → a planned upgrade (use `cap-upgrade-cds`, read the guide, run
     `cds upgrade`).
3. **Check runtime alignment:** ensure `@sap/cds` (runtime) and `@sap/cds-dk` (tooling) are on
   compatible majors; flag transitive pins holding `@sap/cds` back.
4. **Security:** run `npm audit` (and any org scanner); list advisories to address.
5. **Recommend automation:** if absent, propose Dependabot/Renovate grouping CAP packages, with
   CI gating (see `templates/dependabot.yml`).
6. **Output:** a prioritized list — quick safe bumps now, majors as planned upgrades, security
   fixes flagged.

Keep the runtime pinned and the lockfile committed; prefer frequent small updates over letting
versions drift.
