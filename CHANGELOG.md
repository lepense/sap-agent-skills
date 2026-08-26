# Changelog

All notable changes to this project are documented here. Versions are git tags.

## v0.9.1
- Repo hygiene: add `CHANGELOG.md`, issue templates, and a pull-request template.

## v0.9.0
- Add `cap-deploy` plugin — deploy CAP apps to SAP BTP: production facets, MTA on Cloud
  Foundry, Kyma/Helm, SAP HANA, XSUAA/approuter, hybrid testing, multitenancy, CI/CD.

## v0.8.0
- Add `cap-testing` plugin — the `cds.test` harness, HTTP + programmatic service tests,
  authentication/mock users, test data, Java (JUnit) tests, and CI.
- Fix: scope the engine test runner to an explicit list of `scripts/*.test.mjs` files so
  plugin example `*.test.js` templates are not executed (and it works on Node 20 CI).

## v0.7.0
- Narrow scope to **CAP full-stack**: keep `sap-cap`, `sapui5`, `sap-fiori-tools`; remove
  `sap-abap` and `sap-abap-cds` (still available in history and tag `v0.6.0`).
- Reframe README around the CAP stack; add `CONTRIBUTING.md`.

## v0.6.0
- Add `sap-abap-cds` plugin (later removed in v0.7.0).

## v0.5.0
- Add `sap-abap` plugin (later removed in v0.7.0).

## v0.4.0
- Add `sap-fiori-tools` plugin — Application Generator, Page Map, Guided Development,
  annotation tooling, mock/backend preview.

## v0.3.0
- Add `sapui5` plugin — MVC with XML views, models/binding, `manifest.json`, routing, UI5
  Tooling, Fiori elements.

## v0.2.0
- Add `sap-cap` golden-slice plugin — declarative-first CAP (Node.js/Java): CDS modeling,
  services, handlers, Fiori annotations, security, deployment; commands, agents, a
  `cds compile` hook, and CAP MCP wiring.

## v0.1.0
- Foundation: repository engine (`validate`, `sync-manifests`, `run-evals` + unit tests),
  JSON schemas, source-verification ledger, CI workflows, docs, MIT license, README.
