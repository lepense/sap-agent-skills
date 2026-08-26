# Prepare for production

Moving from local dev (in-memory SQLite + mocked auth) to BTP means adding production facets
and building deployables. Run the `cds add` facets once per project.

## Facets

```sh
cds add hana          # SAP HANA persistence (adds hdb deployer + dependencies)
cds add xsuaa         # XSUAA auth (generates xs-security.json from your CDS roles)
cds compile --to xsuaa   # regenerate xs-security.json after auth annotation changes
cds add mta           # Cloud Foundry MTA (mta.yaml)         — pick this OR kyma
cds add kyma          # Kyma/Kubernetes Helm charts (gen/chart)
cds add approuter     # standalone app router; or: cds add workzone / cds add portal
cds add multitenancy  # SaaS multitenancy (MTX sidecar)
```

`cds add` updates `package.json` and generates the descriptors; re-running is idempotent per
facet. For Java, `cds add mta`/`kyma` also wires Spring Boot Actuator health probes.

## Build

```sh
cds build --production
```

Generates deployables under `gen/` — typically `gen/srv` (service) and `gen/db` (HANA
artifacts). Smoke-test locally:

```sh
cd gen/srv && npx cds-serve
```

## Profiles

CAP uses configuration profiles. `development` = SQLite + mocked auth; `production` = HANA +
XSUAA. Keep production settings under the `production` profile in `package.json`/`.cdsrc.json`
so dev config never leaks into a deployment.

## Checklist before building

- Facets added (`hana`, `xsuaa`, `mta`/`kyma`).
- `xs-security.json` regenerated after any auth-annotation change.
- No dev-only config in the production profile.
- `cds build --production` succeeds and `gen/srv` runs via `cds-serve`.
