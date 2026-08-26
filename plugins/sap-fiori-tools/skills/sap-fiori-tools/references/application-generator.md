# Application Generator

Scaffolds a Fiori elements or freestyle SAPUI5 app from a data source.

## Launch

- **VS Code / BAS:** command palette → *Fiori: Open Application Generator*.
- **CLI:** `npx @sap/generator-fiori` (the Yeoman-based generator).

## Steps

1. **Template / floorplan:** List Report Object Page, Worklist, Overview Page, Analytical
   List Page, Form Entry Object Page, or a freestyle SAPUI5 template.
2. **Data source:**
   - *Connect to a system* (SAP system / service URL),
   - *Use a local metadata file* (`metadata.xml`),
   - *Use a CAP project* (point at the CAP folder; the generator reads its services).
3. **Entity selection:** main entity (and navigation entity for the Object Page).
4. **Project attributes:** module name, app namespace, title, description, min UI5 version,
   and whether to add deployment/FLP config.

## Output

A ready-to-run app:

```
<app>/
  webapp/
    manifest.json          # descriptor with the Fiori elements template config
    annotations/            # local annotation file(s)
    Component.js
    i18n/
  ui5.yaml                 # UI5 Tooling + Fiori tools middleware
  package.json             # start / start-mock / build / deploy scripts
```

The app uses the `sap.fe.templates` component; behavior is driven by annotations, not code.
Refine it with the Page Map and Guided Development rather than hand-editing boilerplate.
