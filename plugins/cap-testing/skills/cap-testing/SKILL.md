---
name: cap-testing
description: Test SAP CAP applications with the cds.test harness — HTTP and programmatic service tests, authentication/mock users, test data, Java (JUnit) tests, and CI.
license: MIT
---

# CAP testing

## What this covers

Testing SAP CAP applications end to end: the **`cds.test`** harness for Node.js, HTTP and
programmatic service tests, authentication with **mock users**, **test data**, **Java**
(JUnit) tests, and running it all in **CI**. Prefer fast, deterministic tests against the
in-memory database and mocked auth; reserve real-service integration tests for what genuinely
needs them. Detail lives in [references/](references).

## The cds.test harness (Node.js)

`cds.test` launches the CAP server in-process and gives you bound HTTP helpers and Chai's
`expect`:

```js
const cds = require('@sap/cds')
const { GET, POST, expect } = cds.test(__dirname + '/..')  // project root

describe('CatalogService', () => {
  it('serves books', async () => {
    const { data } = await GET`/odata/v4/browse/Books`
    expect(data.value).to.be.an('array')
  })
})
```

- `cds.test(dir)` boots the model, deploys to an in-memory SQLite DB, and starts the server.
- Assertions use **Chai** (`@cap-js/cds-test` v1 ships Chai 6, ESM). Use `cds.test.expect`
  or the helper's `expect`.

See [references/cds-test.md](references/cds-test.md).

## HTTP vs programmatic tests

- **HTTP (integration-style):** `GET`/`POST` (and tagged-template `GET\`/path\``) exercise the
  full OData/protocol layer. See [references/http-tests.md](references/http-tests.md).
- **Programmatic (service-level):** `cds.connect.to('AdminService')` and run CQL directly to
  test business logic without the protocol. See
  [references/programmatic-tests.md](references/programmatic-tests.md).

Test business logic programmatically (fast, focused) and cover protocol/routing/annotations
with a few HTTP tests.

## Authentication and mock users

Restricted services need an authenticated user. Configure **mock users** under
`cds.requires.auth` (development profile) and pass credentials per request or as defaults:

```js
await GET('/odata/v4/admin/Books', { auth: { username: 'alice', password: '' } })
// or: cds.test(...).defaults.auth = { username: 'alice', password: '' }
```

Test both the **401** (anonymous) and **200/authorized** paths, and role-based `@restrict`
rules with different mock users. See [references/auth-mocking.md](references/auth-mocking.md).

## Test data

Provide deterministic data as CSV under `test/data/` (or reuse `db/data/`), or insert per-test
with `INSERT.into(...)`. Keep each test's data focused and independent. See
[references/test-data.md](references/test-data.md).

## Java tests

CAP Java uses **JUnit 5** with Spring Boot Test: `@SpringBootTest`, `MockMvc` for OData
endpoints, and unit tests for handlers with an injected/mocked `PersistenceService`. See
[references/java-testing.md](references/java-testing.md).

## Running and CI

- **Node runners:** `node --test`, `jest`, or `mocha` (note Chai-6-ESM/Jest interop caveats).
- **Against cloud services:** wrap with bindings — `cds bind --exec -- node --test`.
- **CI:** run the unit/integration suite on every push; keep it green as a merge gate. See
  [references/ci-integration.md](references/ci-integration.md).

## Anti-patterns (Don't)

- **Don't** test only through HTTP — cover business logic programmatically for speed.
- **Don't** depend on external systems in unit tests — use the in-memory DB and mock auth.
- **Don't** share mutable state between tests — insert focused data per test.
- **Don't** skip the negative cases — assert `401`/`403` and validation errors, not just happy
  paths.
- **Don't** hardcode secrets for cloud tests — inject via `cds bind`.
- **Don't** leave flaky, order-dependent tests — each test must pass in isolation.

## References

- [references/cds-test.md](references/cds-test.md) — the cds.test harness.
- [references/http-tests.md](references/http-tests.md) — HTTP/OData tests.
- [references/programmatic-tests.md](references/programmatic-tests.md) — service-level tests.
- [references/auth-mocking.md](references/auth-mocking.md) — mock users and authorization.
- [references/test-data.md](references/test-data.md) — deterministic test data.
- [references/java-testing.md](references/java-testing.md) — CAP Java / JUnit tests.
- [references/ci-integration.md](references/ci-integration.md) — running tests in CI.
- [references/coverage-strategy.md](references/coverage-strategy.md) — what to test where.
