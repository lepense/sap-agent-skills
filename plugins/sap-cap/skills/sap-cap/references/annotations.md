# Annotations

Annotations are the declarative-first core. They live in `.cds` files and drive OData
metadata and Fiori elements without any handler code. Keep UI annotations in `app/`.

## Common / labels

```cds
annotate CatalogService.Books with @title: '{i18n>Book}' {
  title  @title: '{i18n>Title}';
  author @title: '{i18n>Author}' @Common.Text: author.name;
}
```

`@title` maps to `@Common.Label`; `@description` maps to `@Core.Description`. Prefer these
protocol-agnostic aliases over raw OData vocabulary terms.

## Field control

```cds
annotate CatalogService.Books with {
  title  @mandatory;   // Common.FieldControl = Mandatory
  author @readonly;    // Common.FieldControl = ReadOnly
}
annotate CatalogService.Books with { discount @UI.Hidden: (price < 10); }
```

## Fiori elements UI

```cds
annotate CatalogService.Books with @(UI: {
  SelectionFields: [ ID, price, currency_code ],
  LineItem: [
    { Value: title },
    { Value: author.name, Label: '{i18n>Author}' },
    { Value: price },
    { Value: currency.symbol, Label: ' ' }
  ]
});
```

## Value help

```cds
annotate CatalogService.Books with {
  genre @Common.ValueList: { CollectionPath: 'Genres' };
}
```

## Validation constraints

Declare validation instead of coding it where possible:

```cds
entity Books {
  stock : Integer  @assert.range: [0, 9999];
  isbn  : String   @assert.format: '^[0-9-]{10,17}$';
  title : String   @mandatory;
}
```

CAP validates these automatically and returns OData errors on violation.
