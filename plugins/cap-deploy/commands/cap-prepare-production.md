---
description: Prepare a CAP project for production on SAP BTP (facets + build).
---

Prepare the user's CAP app for a production deployment. Steps:

1. **Choose the target:** Cloud Foundry (MTA) or Kyma (Helm). This decides `cds add mta` vs
   `cds add kyma`.
2. **Add production facets** (run once): `cds add hana`, `cds add xsuaa`, then
   `cds add mta` (or `cds add kyma`), and a UI/entry option (`cds add approuter` |
   `workzone` | `portal`). Add `cds add multitenancy` only for SaaS.
3. **Generate the XSUAA descriptor:** after any `@requires`/`@restrict` change, run
   `cds compile --to xsuaa` so `xs-security.json` matches your roles.
4. **Build:** `cds build --production` → verify `gen/srv` and `gen/db` are produced.
5. **Smoke test the build:** `cd gen/srv && npx cds-serve` (optional).
6. **Check profiles:** production profile uses HANA + XSUAA; no in-memory SQLite or mocked
   auth leaking into it.

Report a checklist of what was added/generated and the exact next deploy command
(`cds up` / `mbt build && cf deploy ...` / `cds up -2 k8s`). Prefer `cds add` facets over
hand-writing descriptors.
