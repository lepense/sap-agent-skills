# MTA on Cloud Foundry

A Multi-Target Application (MTA) bundles all deployment modules and their required services
into one archive deployed atomically to Cloud Foundry.

## Build and deploy

```sh
npm i -g mbt                 # Cloud MTA Build Tool (once)
cds build --production       # generate deployables
mbt build                    # -> mta_archives/<app>_<version>.mtar
cf login                     # target org/space
cf deploy mta_archives/<app>_<version>.mtar
```

Or the CAP convenience `cds up` (builds + deploys when `mta.yaml` is present).

## Typical modules and resources

- **Service module** (`nodejs` or `java`, `path: gen/srv`) — the CAP app; requires the HANA
  container and XSUAA.
- **DB deployer** (`hdb`, `path: gen/db`) — deploys the HANA schema.
- **Approuter** (`nodejs`/`approuter`) — login, token flow, serves UIs.
- **HTML5 apps deployer** (`com.sap.application.content`) — pushes built UIs to the HTML5
  Application Repository (for Fiori apps).
- **Resources:** `hdi-shared` HANA container, `xsuaa` instance (`path: ./xs-security.json`),
  `html5-apps-repo`, `destination`, and (multitenant) `saas-registry`.

See the `mta.yaml` template in this skill.

## Updating a deployment

Re-run `cds build --production && mbt build && cf deploy ...`. `cf deploy` performs a
blue-green-style update of the MTA modules. Increment the `version` in `mta.yaml` for
traceable releases.

## Tips

- Use an **MTA extension descriptor** (`.mtaext`) for environment-specific values (URLs,
  destinations) instead of editing `mta.yaml` per landscape.
- Keep `gen/` out of version control; it's build output.
