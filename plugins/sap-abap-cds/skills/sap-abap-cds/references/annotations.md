# Annotation catalog

CDS annotations add semantics and drive frameworks (OData, Fiori elements, analytics,
search). Place them where they belong per the VDM.

## Semantics (`@Semantics.*`)

Essential for correct downstream formatting:

```abap
@Semantics.amount.currencyCode: 'CurrencyCode'
price as Price,
@Semantics.quantity.unitOfMeasure: 'Unit'
quantity as Quantity,
@Semantics.currencyCode: true
currency_code as CurrencyCode
```

Also: `@Semantics.user.createdBy`, `@Semantics.systemDateTime.*`, `@Semantics.text: true`.

## UI (`@UI.*`)

Fiori elements rendering — prefer a **metadata extension** (`.ddlx`) over inline:

```abap
@UI: {
  lineItem: [ { position: 10 } ],
  identification: [ { position: 10 } ],
  selectionField: [ { position: 10 } ]
}
```

## OData & value help (`@Consumption.*`, `@ObjectModel.*`)

```abap
@Consumption.valueHelpDefinition: [ { entity: { name: 'ZI_Author', element: 'Id' } } ]
@ObjectModel.text.element: [ 'AuthorName' ]
```

## Search

`@Search.searchable: true` on the view + `@Search.defaultSearchElement: true` on fields
enables fuzzy search.

## Where annotations live

- **Interface views:** `@Semantics`, `@ObjectModel`, associations — stable semantics.
- **Consumption views / metadata extensions:** `@UI`, `@Consumption`, `@OData` — presentation.

Keeping UI annotations out of interface views preserves their reusability.
