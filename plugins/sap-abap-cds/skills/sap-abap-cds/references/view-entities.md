# View entities

Use `DEFINE VIEW ENTITY` for all new CDS models. It replaces the legacy
`DEFINE VIEW ... WITH` (which also generated a database view); view entities are cleaner,
have consistent session handling, and manage associations without extra artifacts.

## Structure

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Book'
define view entity ZI_Book
  as select from zbook
{
  key id        as Id,
      title     as Title,
      price     as Price,
      currency_code as CurrencyCode
}
```

## Elements

- **Key fields** with `key`.
- **Aliases** with `as` — expose stable, CamelCase names to consumers.
- **Calculated fields** with expressions: `price * stock as InventoryValue`.
- **CASE** expressions, `cast(... as ...)`, built-in functions (`concat`, `dats_add_days`,
  aggregations in analytical views).
- **Literals and parameters:** `define view entity ... with parameters p_date : abap.dats`.

## Joins vs associations

Use `inner join` / `left outer join` for pure set operations; prefer **associations** when
the relationship should be reusable and navigable (see associations reference). Avoid
`SELECT *`-style exposure — list exactly the fields consumers need.

## Grouping and aggregation

```abap
define view entity ZI_BookSalesByAuthor
  as select from ZI_Sales
{
  key AuthorId,
      sum(amount) as TotalAmount
}
group by AuthorId
```

Aggregated views feed analytical consumption and KPI queries.
