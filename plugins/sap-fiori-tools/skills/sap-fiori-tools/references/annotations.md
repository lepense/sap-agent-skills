# Annotations and the annotation language server

Fiori elements renders from **OData/UI annotations**. Fiori tools provides a language server
with completion, validation, and navigation for editing them.

## Where annotations live

- **Local annotation file** — `webapp/annotations/annotation.xml` (OData vocabulary XML),
  referenced from `manifest.json` `sap.app.dataSources`.
- **CAP CDS** — when the backend is CAP, annotate in `.cds` (`@UI.*`) and let CAP emit the
  metadata; Fiori tools reads it.
- **Backend** — annotations delivered by the service `$metadata`.

## Key UI annotations

- `@UI.HeaderInfo` — Object Page header (title/description/type).
- `@UI.SelectionFields` — List Report filter bar fields.
- `@UI.LineItem` — table columns.
- `@UI.FieldGroup` — grouped fields in forms/sections.
- `@UI.Facets` — Object Page sections (referencing FieldGroups/tables).
- `@UI.Identification` — actions/fields for the header.
- `@Common.ValueList` / `@Common.Text` — value help and text arrangement.

## XML annotation example

```xml
<Annotations Target="CatalogService.Books">
  <Annotation Term="UI.LineItem">
    <Collection>
      <Record Type="UI.DataField"><PropertyValue Property="Value" Path="title"/></Record>
      <Record Type="UI.DataField"><PropertyValue Property="Value" Path="price"/></Record>
    </Collection>
  </Annotation>
</Annotations>
```

Use the language server's completion to author these correctly. When the backend is CAP,
prefer CDS annotations (`@UI.LineItem: [...]`) — they are terser and validated by CAP.
