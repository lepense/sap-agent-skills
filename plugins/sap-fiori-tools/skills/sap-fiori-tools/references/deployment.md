# Deployment

Fiori tools generates deployment configuration for the two common targets: **ABAP** (on-prem
or BTP ABAP environment) and **Cloud Foundry** (HTML5 Application Repository).

## Add deployment config

```sh
fiori add deploy-config
```

This asks for the target and writes `ui5-deploy.yaml` (and updates `package.json`).

## ABAP target

`ui5-deploy.yaml` configures the `deploy-to-abap` task with the destination/URL, the BSP
application name (`/UI5/…`), package, and transport. Deploy with:

```sh
npm run deploy       # fiori deploy --config ui5-deploy.yaml
```

The app is uploaded as a BSP application and can be exposed via a Fiori launchpad tile
(`fiori add flp-config`).

## Cloud Foundry target

For CF/HTML5 Application Repository, deployment typically goes through an MTA (`mta.yaml`)
that bundles the built app (`dist/`) into an `html5` module deployed to the HTML5 repo and
surfaced through SAP Build Work Zone. When the app is part of a CAP project, add it to the
CAP MTA and deploy together.

## Before deploying

Run `ui5 build` (or `npm run build`) and preview the built app. Confirm the destination and
BSP/HTML5 names are correct — deployment overwrites the target application.
