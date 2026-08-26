---
description: Pre-deployment checklist for an SAP CAP app targeting SAP BTP.
---

Run a pre-deployment review of the user's CAP project before shipping to Cloud Foundry or
Kyma. Verify each item and report pass/fail:

1. **Production facets present:** `cds add hana`, `cds add xsuaa`, and `cds add mta`
   (or `cds add kyma`) have been run — check for `mta.yaml` and `xs-security.json`.
2. **Auth descriptor current:** `xs-security.json` reflects the current CDS roles; if
   `@requires`/`@restrict` changed, re-run `cds compile --to xsuaa`.
3. **Build succeeds:** `cds build --production` generates `gen/srv` and `gen/db` without
   errors.
4. **Bindings wired:** `mta.yaml` binds the service module to the HANA `hdi-shared` container
   and the XSUAA instance.
5. **No local-only config leaking:** in-memory SQLite and mocked auth are dev-only; confirm
   production profile uses HANA + XSUAA.
6. **Secrets:** no credentials/tenant IDs hardcoded — everything via service bindings.
7. **Smoke test:** `mbt build` produces an `.mtar`; deploy to a test space with `cf deploy`
   and hit a service endpoint.

Report a concise checklist result. If anything is missing, give the exact `cds add ...` or
`cds compile ...` command to fix it. Verify uncertain CLI flags via the CAP MCP server.
