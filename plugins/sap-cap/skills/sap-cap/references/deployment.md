# Deployment

Local development uses an in-memory SQLite database and mocked auth. Moving to production
means adding production facets and deploying to SAP BTP (Cloud Foundry or Kyma).

## Prepare for production (run once per project)

```sh
cds add hana         # use SAP HANA in production
cds add xsuaa        # add XSUAA authentication
cds compile --to xsuaa   # (re)generate xs-security.json after auth annotation changes
cds add mta          # create mta.yaml (MTA-based deployment)
# UI serving options: cds add portal | approuter | workzone | app-frontend
cds add multitenancy # optional: enable multitenancy
```

`cds add <facet>` updates `package.json` and generates descriptors (`mta.yaml`,
`xs-security.json`). Re-run `cds compile --to xsuaa` whenever you change `@requires`/
`@restrict` annotations.

## Build and deploy

```sh
cds build --production      # generate deployable artifacts under gen/
cds up                      # build + deploy (convenience)
# or, MTA archive workflow:
mbt build && cf deploy mta_archives/<app>_<version>.mtar
```

## Database

- **Local:** in-memory SQLite via `cds watch`.
- **Production:** SAP HANA Cloud (`cds add hana`), deployed as an `hdb` module bound to an
  `hdi-shared` HANA container in `mta.yaml`.

## Kyma alternative

```sh
cds add hana,xsuaa
cds add kyma          # Helm-based deployment instead of MTA
cds up
```

## Notes

- Keep the `db/srv/app` module structure; the MTA descriptor references generated artifacts
  under `gen/`.
- For multitenant apps, add the MTX sidecar and `saas-registry` (see
  [multitenancy.md](multitenancy.md)).
