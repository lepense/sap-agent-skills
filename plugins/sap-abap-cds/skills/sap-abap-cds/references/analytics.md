# Analytical CDS

CDS can expose data as analytical models (cubes and dimensions) consumed by Fiori analytical
apps, KPIs, and Analytics.

## Data category

Classify views with `@Analytics.dataCategory`:

- **`#DIMENSION`** — master-data-like, has a key and texts (e.g. Author, Product).
- **`#CUBE`** — facts with measures and associations to dimensions.
- **`#FACT`** — facts without exposed dimensions.
- Aggregation behavior via `@DefaultAggregation` and `@Aggregation.default` on measures.

```abap
@Analytics.dataCategory: #CUBE
define view entity ZI_BookSalesCube
  as select from ZI_Sales
  association [1..1] to ZI_Author as _Author on $projection.AuthorId = _Author.Id
{
  key AuthorId,
      @DefaultAggregation: #SUM
      amount as Amount,
      _Author
}
```

## Object model

`@ObjectModel.*` classifies the VDM and links texts/value-helps:

```abap
@ObjectModel.dataCategory: #TEXT
@ObjectModel.representativeKey: 'Id'
```

## Consumption

Build an analytical **query** view (`@Analytics.query: true`) on top of the cube to define the
default rows/columns/filters presented to the analytical UI.

## Guidance

Model cubes and dimensions in interface views, and analytical queries in a dedicated query
view. Always set aggregation semantics on measures so totals compute correctly.
