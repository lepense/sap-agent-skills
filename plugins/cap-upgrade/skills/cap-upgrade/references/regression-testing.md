# Regression testing an upgrade

Your test suite is the proof an upgrade is safe. Without it, a green build tells you almost
nothing.

## Before upgrading

- Ensure the suite is **green on the current version** — a stable baseline.
- Fill coverage gaps in areas the upgrade touches (auth, OData behavior, custom handlers,
  remote services, messaging) — see the `cap-testing` skill.

## After each change

Run the full gate on the upgraded version:

```sh
npm ci
npm test            # cds.test unit + integration (Node)
# Java:
mvn test
cds build           # confirm the model still builds for production
```

## What to watch for across majors

- **Changed defaults:** auth strategy, database, OData version/behavior, pagination.
- **Removed/renamed APIs:** handler signatures, config keys (`cds.requires.*`).
- **Query/CQN semantics:** subtle result differences — assert on data, not just status codes.
- **Generated artifacts:** re-check `xs-security.json` (`cds compile --to xsuaa`) and build
  output.

## Hybrid + smoke

After the offline suite passes, run a **hybrid** session against real HANA/XSUAA and a smoke
test in a test space/namespace before promoting.

## Guidance

Baseline green → upgrade → full suite green → `cds build` → hybrid → deploy. Treat any new test
failure as a migration task, and add a test for anything the upgrade surfaced.
