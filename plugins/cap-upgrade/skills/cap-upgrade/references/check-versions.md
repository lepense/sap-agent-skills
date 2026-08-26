# Checking versions

Know exactly what you're running before you change anything.

## Commands

```sh
cds version          # installed @sap/cds-dk (design-time) + Node.js and npm paths
npm ls @sap/cds      # the runtime version actually resolved in node_modules
npm outdated         # dependencies with newer available versions
node -v && npm -v    # runtime toolchain
```

Example `cds version` output:

```
@sap/cds-dk  9.6.1
Node.js      24.12.0
```

## What to look at

- **Runtime vs tooling drift:** the resolved `@sap/cds` (runtime) and the global `@sap/cds-dk`
  (tooling) should be on compatible majors. Large gaps cause confusing build/runtime
  differences.
- **Transitive pins:** `npm ls @sap/cds` shows if a dependency forces an older `@sap/cds`.
- **Outdated majors:** `npm outdated` flags where you're a major behind — those need a
  migration-guide read, not a blind bump.

## Guidance

Record the current `@sap/cds`, `@sap/cds-dk`, plugin, and Node/JDK versions before upgrading,
so you can compare and roll back if needed. Do this in a clean working tree.
