# Test data

Deterministic data makes tests reliable. CAP gives you two complementary approaches.

## CSV fixtures

Provide CSVs under `db/data/` (shared with dev) or a test-only folder, named
`<namespace>-<Entity>.csv`:

```
db/data/my.bookshop-Books.csv
ID;title;stock;price;currency_code
201;Wuthering Heights;12;11.11;GBP
```

`cds.test` deploys these into the in-memory DB at startup, so every test file starts from a
known baseline.

## Per-test inserts

For focused, isolated cases, insert exactly what the test needs:

```js
beforeEach(async () => {
  await DELETE.from('my.bookshop.Books')
  await INSERT.into('my.bookshop.Books').entries(
    { ID: 1, title: 'A', stock: 0, price: 10 },
    { ID: 2, title: 'B', stock: 5, price: 20 },
  )
})
```

## Guidance

- Keep fixtures small and meaningful; avoid depending on large shared datasets.
- Make each test independent — don't rely on data another test created or on execution order.
- Use per-test inserts for edge cases (empty stock, boundary prices) and CSVs for the common
  baseline.
- Separate test-only data from production seed data so you never ship test rows.
