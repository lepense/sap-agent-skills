---
name: sapui5
description: Build SAPUI5 and OpenUI5 applications using MVC with XML views, models and data binding, the manifest.json descriptor, routing, UI5 Tooling, and Fiori elements.
license: MIT
---

# SAPUI5 developer

## What this covers

Building freestyle and Fiori elements apps with **SAPUI5** (or its open-source core
**OpenUI5**). SAPUI5 is an MVC framework: declarative **XML views**, JavaScript
**controllers**, and **models** bound to controls. Prefer declarative XML views and
manifest-driven configuration over imperative control creation. Language-specific detail
lives in the [references/](references) folder.

## SAPUI5 vs OpenUI5

- **OpenUI5** — Apache-2.0 open-source core (`sap.m`, `sap.ui.core`, ...).
- **SAPUI5** — superset with additional libraries (e.g. `sap.ui.comp`, smart controls,
  Fiori elements) under the SAP license.

Choose the framework in `ui5.yaml`; the programming model is identical.

## Project structure and tooling

Use **UI5 Tooling** (`@ui5/cli`, the `ui5` command):

```sh
ui5 init            # create ui5.yaml for the project
ui5 serve           # run the local dev server
ui5 build           # produce an optimized production build (dist/)
```

`ui5.yaml` declares `specVersion`, `metadata.name`, `type` (`application` or `library`),
and the `framework` (name `SAPUI5`/`OpenUI5`, version, and required `libraries`).

Recommended layout:

```
webapp/
  manifest.json         # app descriptor
  Component.js          # component controller (app entry)
  index.html            # bootstrap
  view/                 # XML views
  controller/           # controllers
  model/                # formatters, model helpers
  i18n/i18n.properties  # translatable texts
ui5.yaml
```

## The app descriptor (manifest.json)

`manifest.json` is the central, declarative configuration. It has three namespaces:

- **`sap.app`** — app id, type, i18n, and `dataSources` (e.g. OData services).
- **`sap.ui`** — technical UI info (device support, theme).
- **`sap.ui5`** — UI5 runtime config: `dependencies` (libraries), `models` (named model
  definitions incl. OData and i18n), `routing` (routes + targets), `rootView`.

Configure models and routing here rather than in code. See
[references/manifest-routing.md](references/manifest-routing.md).

## MVC: views and controllers

Prefer **XML views** — declarative, tooling-friendly, async-capable:

```xml
<mvc:View controllerName="my.app.controller.List"
    xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">
  <Page title="{i18n>listTitle}">
    <List items="{/Books}">
      <StandardListItem title="{title}" description="{author/name}"/>
    </List>
  </Page>
</mvc:View>
```

Controllers hold view logic and lifecycle hooks (`onInit`, `onAfterRendering`). Keep them
thin: no business rules that belong on the backend. See [references/mvc.md](references/mvc.md).

## Models and data binding

Bind controls to named models configured in the manifest:

- **JSONModel** — client-side/local state.
- **OData V4 model** (`sap.ui.model.odata.v4.ODataModel`) — preferred for new apps.
- **OData V2 model** — for existing V2 services.
- **ResourceModel** (`i18n>`) — translatable texts.

Binding syntax: property `{path}`, aggregation `items="{/Entity}"` with a template, relative
paths via a binding context, and expression binding `{= ${price} > 100 }`. Details in
[references/models-binding.md](references/models-binding.md) and
[references/odata.md](references/odata.md).

## Freestyle vs Fiori elements

- **Fiori elements** — metadata/annotation-driven apps (List Report, Object Page). Prefer
  when the app is standard CRUD over an OData service with UI annotations — minimal custom
  code. See [references/fiori-elements.md](references/fiori-elements.md).
- **Freestyle** — full control with custom XML views/controllers for non-standard UIs.

Start with Fiori elements when annotations can express the UI; fall back to freestyle for
bespoke interactions.

## Anti-patterns (Don't)

- **Don't** build UI imperatively in controllers when an XML view expresses it.
- **Don't** configure models/routing in code when the manifest can declare them.
- **Don't** hardcode user-facing strings — use the i18n ResourceModel.
- **Don't** put business logic in the client that belongs in the backend service.
- **Don't** access controls by hand-built ids across views — use binding and `byId`.
- **Don't** ship without `ui5 build`; the unoptimized `webapp/` is for development only.

## References

- [references/mvc.md](references/mvc.md) — views, controllers, lifecycle.
- [references/models-binding.md](references/models-binding.md) — models and binding.
- [references/manifest-routing.md](references/manifest-routing.md) — descriptor and routing.
- [references/odata.md](references/odata.md) — OData V2/V4 models.
- [references/controls.md](references/controls.md) — common `sap.m` controls.
- [references/fiori-elements.md](references/fiori-elements.md) — annotation-driven apps.
- [references/tooling.md](references/tooling.md) — UI5 Tooling and build.
- [references/testing.md](references/testing.md) — QUnit and OPA5.
