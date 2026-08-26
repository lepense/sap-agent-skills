# Preview and mock data

Fiori tools can preview an app against a **real backend** or **mock data**, so you can
validate the UI before (or without) a live service.

## Preview scripts

The generator adds npm scripts to `package.json`, typically:

```json
"scripts": {
  "start": "fiori run --open \"index.html\"",
  "start-mock": "fiori run --open \"index.html?sap-ui-xx-viewCache=false\" --config ./ui5-mock.yaml",
  "build": "ui5 build --clean-dest",
  "deploy": "fiori deploy --config ui5-deploy.yaml"
}
```

- `npm start` — preview against the configured backend (`ui5.yaml` fiori-tools proxy).
- `npm run start-mock` — preview against the mock server (`ui5-mock.yaml`).

## Mock server

`ui5-mock.yaml` wires the `sap-fe-mockserver` middleware to serve the OData service from
`metadata.xml` plus mock data files (JSON/CSV) under a `localService`/mockdata folder. Edit
the mock data to exercise edge cases (empty lists, long text, many rows).

## Command palette

*Fiori: Preview Application* offers the same run configurations interactively.

## Guidance

Validate every new page/annotation against **mock** data first — it's fast and deterministic
— then switch to the real backend to confirm the service wiring.
