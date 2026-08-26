# The cds.test harness

`cds.test` is the CAP Node.js test driver. It boots the CAP server in-process, deploys the
model to an in-memory SQLite database, and returns bound helpers.

## Launching

```js
const cds = require('@sap/cds')
// Point at the project root (folder containing the CAP model / package.json)
const test = cds.test(__dirname + '/..')
const { GET, POST, PUT, PATCH, DELETE, expect } = test
```

- `cds.test(dir)` — start once per test file (top level or in `before`).
- `cds.test.in(dir)` / passing args mirrors the `cds serve` CLI.
- The in-memory DB is initialized from your CSV data, giving deterministic fixtures.

## Assertions (Chai)

`@cap-js/cds-test` v1 uses **Chai 6** (ESM). Access `expect` from the harness:

```js
const { expect } = cds.test
expect(42).to.be.a('number').gt(41)
```

If you need Chai APIs beyond `expect`, install and import `chai` directly (Chai 5+ is
ESM-only, so the harness cannot always re-export the instance — relevant under Jest).

## Lifecycle

- The server starts before your tests and shuts down after the file.
- Data resets come from redeploying the in-memory DB; for isolation, insert focused data per
  test (see [test-data.md](test-data.md)) rather than relying on cross-test order.

## Runners

Works with `node --test`, `mocha`, and `jest`. With Jest, be aware of Chai-6-ESM interop
edge cases — prefer `node:test` or `mocha` when in doubt.
