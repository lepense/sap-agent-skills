# Dependency hygiene

Small, frequent, automated updates make major upgrades painless. Big-bang upgrades after years
of drift are the risky ones.

## Pin the runtime, track tooling

- **`@sap/cds`** (runtime) — pinned with a caret in `dependencies` and locked via
  `package-lock.json` for reproducible builds.
- **`@sap/cds-dk`** and other dev tools — kept current in `devDependencies`.
- Commit the **lockfile**; CI installs with `npm ci` for deterministic builds.

## Automate updates

Use **Dependabot** or **Renovate** to open PRs for dependency bumps:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule: { interval: weekly }
    groups:
      cap:
        patterns: ["@sap/cds", "@sap/cds-dk", "@cap-js/*"]
```

Group CAP packages so they bump together. Gate every PR on the CI test suite.

## Cadence

- **Patch/minor:** merge promptly once CI is green.
- **Major:** treat as a planned upgrade (see the major-upgrade process) — read the guide, run
  `cds upgrade`, test.

## Audit

Run `npm audit` / your security scanner and address advisories; keep transitive `@sap/cds`
pins from drifting behind (`npm ls @sap/cds`).

## Guidance

Pin the runtime, automate grouped updates with CI gating, and keep current — so the next major
is a short hop, not a rewrite.
