# Programmatic / service-level tests

Test business logic through the service API and CQL — no HTTP, so tests are fast and focused
on behavior rather than the protocol.

## Connecting to a service

```js
const cds = require('@sap/cds')
cds.test(__dirname + '/..')

it('reads authors consistently across APIs', async () => {
  const AdminService = await cds.connect.to('AdminService')
  const { Authors } = AdminService.entities

  const viaCqn     = await SELECT.from(Authors)
  const viaService = await AdminService.read(Authors)
  const viaRun     = await AdminService.run(SELECT.from(Authors))

  expect(viaCqn).to.eql(viaService).to.eql(viaRun)
})
```

## Testing custom handlers

Drive a custom action/validation and assert the effect:

```js
it('decrements stock on submitOrder', async () => {
  const cat = await cds.connect.to('CatalogService')
  const before = await SELECT.one.from('CatalogService.Books').columns('stock').where({ ID: 201 })
  await cat.send('submitOrder', { book: 201, quantity: 2 })
  const after = await SELECT.one.from('CatalogService.Books').columns('stock').where({ ID: 201 })
  expect(after.stock).to.equal(before.stock - 2)
})

it('rejects a negative price', async () => {
  const admin = await cds.connect.to('AdminService')
  await expect(admin.create('Books', { title: 'X', price: -1 }))
    .to.be.rejected
})
```

## Guidance

Use `cds.connect.to(...)` + `send`/`read`/`create` (or global CQL) to unit-test
determinations, validations, and actions. This is where most of your test coverage should
live; keep HTTP tests for protocol-level assurance.
