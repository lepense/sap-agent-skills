---
name: sap-fiori-tools
description: Generate, model, and preview SAP Fiori elements applications with SAP Fiori tools — Application Generator, Page Map, Guided Development, and annotation tooling in VS Code or SAP Business Application Studio.
license: MIT
---

# SAP Fiori tools

## What this covers

SAP Fiori tools is the official extension pack for **VS Code** and **SAP Business
Application Studio (BAS)** for building **SAP Fiori elements** (and freestyle SAPUI5) apps.
It generates apps from templates, visualizes and edits pages, guides annotation changes, and
previews with real or mock data. Prefer the tools' declarative flows (generator, Page Map,
Guided Development) over hand-editing generated files. Details live in
[references/](references).

## The extension pack

Install **SAP Fiori tools - Extension Pack** (`SAPSE.sap-ux-fiori-tools-extension-pack`).
Key components:

- **Application Generator** — wizard to scaffold Fiori elements floorplans and freestyle
  SAPUI5 apps from a data source.
- **Application Modeler** — includes the **Page Map**: a visual view of pages, navigation,
  and service entities; add/delete pages and open the right editor.
- **Guided Development** — step-by-step guides that apply common changes (add a table
  column, enable draft, add a custom action) as code.
- **Annotation tooling** — a language server for editing OData/UI annotations with
  code completion and validation.
- **Service Modeler** — inspect the OData service metadata and annotations.

## Generating an app

Use the Application Generator (command palette: *Fiori: Open Application Generator*) or the
CLI `@sap/generator-fiori`:

```sh
npx @sap/generator-fiori
```

Pick a **floorplan** (List Report Object Page, Worklist, Overview Page, Analytical List
Page, or a freestyle SAPUI5 template), a **data source** (a running system, a local
`metadata.xml`, or a CAP project), then the main entity. The generator produces a UI5 app
with `manifest.json`, `webapp/`, `ui5.yaml`, and Fiori tools configuration. See
[references/application-generator.md](references/application-generator.md).

## Modeling pages (Page Map)

Open the **Page Map** from the Application Modeler to see the app's pages and navigation.
Add an Object Page under a List Report, wire navigation between entities, and jump to the
annotation or manifest editor for a node. This edits `manifest.json` routing/targets and
annotations for you. See [references/page-map.md](references/page-map.md).

## Guided Development

For standard enhancements, run **Guided Development** and pick a guide (e.g. *Add a custom
column*, *Enable the draft handling*, *Add a custom action*). It shows the steps and applies
the code, keeping the app annotation-driven. See
[references/guided-development.md](references/guided-development.md).

## Annotations

Fiori elements is annotation-driven. Maintain UI annotations (`@UI.LineItem`,
`@UI.SelectionFields`, `@UI.HeaderInfo`, `@UI.FieldGroup`, `@UI.Facets`) in a local
annotation file or in CAP CDS, with the annotation language server for completion and
validation. See [references/annotations.md](references/annotations.md).

## Previewing

Preview with **real backend** data or **mock** data. Fiori tools adds preview scripts and a
mock server config; run *Fiori: Preview Application* or the app's `start`/`start-mock`
npm scripts. See [references/preview-mock.md](references/preview-mock.md).

## Anti-patterns (Don't)

- **Don't** hand-write floorplan boilerplate — generate it, then refine.
- **Don't** hand-edit `manifest.json` routing when the Page Map can model it correctly.
- **Don't** hardcode UI structure in custom code when annotations express it — change
  annotations and let Fiori elements render.
- **Don't** skip mock preview — validate the UI against mock data before wiring a backend.
- **Don't** diverge from the generated project layout; the tools expect it.

## References

- [references/application-generator.md](references/application-generator.md) — scaffolding.
- [references/page-map.md](references/page-map.md) — Application Modeler / Page Map.
- [references/guided-development.md](references/guided-development.md) — guided changes.
- [references/annotations.md](references/annotations.md) — UI annotations + language server.
- [references/preview-mock.md](references/preview-mock.md) — preview and mock data.
- [references/cli.md](references/cli.md) — `@sap/generator-fiori` and the `fiori` CLI.
- [references/deployment.md](references/deployment.md) — deploy to ABAP / Cloud Foundry.
- [references/floorplans.md](references/floorplans.md) — choosing a floorplan.
