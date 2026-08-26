# UI5 Tooling

UI5 Tooling is the official build and development toolchain, distributed as `@ui5/cli`
(the `ui5` command).

## Commands

```sh
ui5 init            # scaffold ui5.yaml for the current project
ui5 serve           # start the local dev server (with live reload options)
ui5 serve --open index.html
ui5 build           # optimized production build into dist/
ui5 build --clean-dest
ui5 add <library>   # add a framework library dependency to ui5.yaml
ui5 use SAPUI5@<version>   # pin the framework + version
```

## ui5.yaml

```yaml
specVersion: "3.0"
metadata:
  name: my.app
type: application
framework:
  name: SAPUI5        # or OpenUI5
  version: "1.120.0"  # pin an available version
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.layout
```

- `type`: `application` or `library`.
- `framework.name`: `SAPUI5` or `OpenUI5`.
- Custom tasks/middleware extend the build/serve pipeline via `builder`/`server` sections.

## Build output

`ui5 build` bundles and minifies into `dist/` (or a configured dest), producing the
deployable artifact. Never deploy the raw `webapp/`; it is for development only.

## Verification

Always run `ui5 build` before deployment to catch missing dependencies and confirm the
optimized bundle loads.
