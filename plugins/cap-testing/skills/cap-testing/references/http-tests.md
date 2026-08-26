# HTTP / OData tests

Exercise the full protocol layer (routing, OData, annotations, auth) with the bound HTTP
helpers from `cds.test`.

## GET / POST helpers

```js
const { GET, POST, expect } = cds.test(__dirname + '/..')

// Tagged-template form (path only)
const res = await GET`/odata/v4/browse/Books/201`
expect(res.status).to.equal(200)
expect(res.data).to.contain({ title: 'Wuthering Heights' })

// Function form with relative path (relative to defaults.path)
const { data: list } = await GET('/browse/Books')

// POST a payload (e.g. a bound action)
await POST('/browse/submitOrder', { book: 201, quantity: 5 })
```

`PUT`, `PATCH`, and `DELETE` helpers are available too. Responses expose `status`, `headers`,
and `data`.

## Errors and status codes

Assert negative paths explicitly:

```js
await expect(GET('/odata/v4/admin/Books')).to.be.rejectedWith(/401/)

try {
  await POST('/browse/submitOrder', { book: 201, quantity: 99999 })
  expect.fail('expected 409')
} catch (e) {
  expect(e.response.status).to.equal(409)
}
```

## OData specifics

- Query options: `GET('/browse/Books?$filter=stock gt 0&$select=title')`.
- Deep reads: `$expand=author`.
- ETags/drafts: send `If-Match` headers where the service requires them.

Use a handful of HTTP tests to prove routing, annotations, and auth wire up; test detailed
business logic programmatically (faster).
