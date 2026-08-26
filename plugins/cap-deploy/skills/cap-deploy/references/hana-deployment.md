# SAP HANA deployment

Production persistence is **SAP HANA Cloud**, deployed through an HDI (HANA Deployment
Infrastructure) container.

## Enable

```sh
cds add hana
cds build --production   # generates gen/db (HDI artifacts: .hdbtable, .hdbview, etc.)
```

`cds add hana` sets HANA as the `production` database and adds an `hdb` deployer module.

## How it deploys

- The **`hdb` deployer module** (`path: gen/db`) runs at deploy time and creates/updates the
  schema in an **`hdi-shared`** HANA container.
- The **service module** binds to the same container and runs queries against it.
- Schema evolution is handled by HDI: changed `.hdbtable`/view artifacts are re-deployed;
  incompatible table changes may require a migration.

## MTA excerpt

```yaml
modules:
  - name: myapp-db-deployer
    type: hdb
    path: gen/db
    parameters: { buildpack: nodejs_buildpack }
    requires: [ { name: myapp-db } ]
resources:
  - name: myapp-db
    type: com.sap.xs.hdi-container
    parameters: { service: hana, service-plan: hdi-shared }
```

## Guidance

- Use `hdi-shared` for the container; a HANA Cloud instance must exist in the space/subaccount.
- For destructive schema changes, plan a migration (HDI will not silently drop data-bearing
  structures).
- Locally, keep using SQLite; only production uses HANA. Test HANA behavior via **hybrid**
  runs (`cds bind`) before deploying.
