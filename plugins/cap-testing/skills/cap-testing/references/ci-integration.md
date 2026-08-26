# Running tests in CI

Keep the suite fast and deterministic so it runs on every push as a merge gate.

## npm scripts

```json
"scripts": {
  "test": "node --test",
  "test:jest": "jest",
  "test:watch": "cds watch"
}
```

`node --test` (Node's built-in runner) or `jest`/`mocha` all work with `cds.test`. Prefer
`node --test` or `mocha` if you hit Chai-6-ESM interop issues under Jest.

## GitHub Actions example

```yaml
name: test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm test
```

## Testing against cloud services

When a test genuinely needs a real binding (e.g. SAP HANA), inject credentials with
`cds bind`:

```sh
cds bind --exec -- node --test
```

Keep these behind a separate job/tag so the default CI run stays fast and offline.

## Java CI

Run `mvn test` (JUnit) for the Java runtime. Use an in-memory datasource so the integration
tests need no external services.

## Guidance

- Unit + in-memory integration tests run offline in seconds — make them the default gate.
- Isolate slow, credential-dependent cloud tests into an opt-in job.
- Fail the build on any test failure; never merge with a red suite.
