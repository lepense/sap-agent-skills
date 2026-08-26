# CLI: generator and fiori

Fiori tools' capabilities are also available on the command line — useful for automation and
CI.

## `@sap/generator-fiori`

The Yeoman-based application generator:

```sh
npx @sap/generator-fiori
# headless generation from a config file:
npx @sap/generator-fiori headless ./config.json
```

Headless mode reads a JSON config describing the floorplan, data source, and entities — good
for scripted/repeatable scaffolding.

## `fiori` CLI (`@sap/ux-ui5-tooling`)

Adds Fiori-specific commands on top of UI5 Tooling:

```sh
fiori run --open "index.html"        # preview (proxy to backend per ui5.yaml)
fiori run --config ./ui5-mock.yaml   # preview with mock server
fiori add deploy-config              # add deployment configuration
fiori add flp-config                 # add Fiori launchpad config
fiori deploy --config ui5-deploy.yaml
```

`fiori run` wraps `ui5 serve` with the Fiori tools middleware (backend proxy, mock server,
FLP sandbox). Use `ui5 build` (or the app's `build` script) for the production bundle.

## In CI

Prefer headless generation and the app's npm scripts (`start-mock`, `build`) so pipelines run
without the VS Code UI.
