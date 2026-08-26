# CAP Node.js reference

Runtime: `@sap/cds`. Service implementations live next to the `.cds` service file
(e.g. `srv/cat-service.js` next to `srv/cat-service.cds`).

## Registering handlers

Export a function; register with `this.before` / `this.on` / `this.after`:

```js
module.exports = function () {
  this.on('submitOrder', (req) => { /* custom action */ })
  this.on('CREATE', 'Books', (req) => { /* replace default CREATE */ })
  this.before('UPDATE', '*', (req) => { /* validate / set defaults */ })
  this.after('READ', 'Books', (books) => { /* enrich the result rows */ })
}
```

- `before` — runs before `on`; use for validation and defaulting. Reject with `req.reject()`
  or `req.error()`.
- `on` — replaces the default implementation for custom actions/functions, or overrides CRUD.
- `after` — runs after `on`; receives the result to enrich or filter.

## The request/event context (`req`)

Common properties: `req.event`, `req.target`, `req.query` (a CQN object), `req.data`,
`req.user`, `req.tenant`, `req.params`. Use `req.reject(code, msg)` to fail with an OData error.

## Querying with `cds.ql`

Never hand-build SQL. Use the fluent query API:

```js
const { Books, Authors } = cds.entities
const books = await SELECT.from(Books).where({ stock: { '>': 0 } })
await UPDATE(Books).set({ stock: { '-=': 1 } }).where({ ID: req.data.book })
await INSERT.into(Authors).entries({ name: 'Kafka' })
```

`SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `UPSERT` are available as global CQL builders
inside handlers. Run cross-service reads via `cds.connect.to('SomeService')`.

## Emitting events

Services are event emitters: `await srv.emit('SomeEvent', { ... })`; subscribe with
`srv.on('SomeEvent', msg => ...)`. This underpins messaging and outbox integration.

## TypeScript

TypeScript handlers work the same way; generate typed model interfaces with `cds typer` and
import them for type-safe `req.data` and query results.
