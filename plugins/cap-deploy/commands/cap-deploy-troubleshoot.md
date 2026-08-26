---
description: Diagnose and fix a failing CAP deployment (build, MTA/CF, Kyma, HANA, or auth).
---

Diagnose the CAP deployment problem methodically:

1. **Classify:** build failure (`cds build`/`mbt build`), deploy failure (`cf deploy`/`cds up`),
   runtime crash (app won't start), or auth/routing (401/403/blank UI).
2. **Build:** missing facet or dependency; `gen/srv`/`gen/db` not produced — re-run
   `cds build --production` and read the error.
3. **CF deploy:** service creation fails (HANA/XSUAA plan not entitled in the space), quota
   exceeded, or module binding wrong. Check `cf services`, `cf deploy` logs, and `mta.yaml`
   requires/provides names.
4. **Runtime crash:** `cf logs <app> --recent` — common causes: DB binding missing, HDI deploy
   failed, or a start error. On Kyma: `kubectl logs <pod>` and `kubectl describe pod`.
5. **HANA:** HDI deploy errors (incompatible table change) — inspect the db-deployer logs; plan
   a migration for destructive changes.
6. **Auth/UI:** stale `xs-security.json` (re-run `cds compile --to xsuaa`), approuter route
   misconfigured (`xs-app.json` destination name), or role collection not assigned to the user.
7. **Isolate with hybrid:** reproduce locally via `cds bind` + `cds watch --profile hybrid` to
   separate app bugs from platform/binding issues.

Apply the minimal fix, redeploy, and verify the endpoint and logs. Report the root cause and
what confirmed the fix.
