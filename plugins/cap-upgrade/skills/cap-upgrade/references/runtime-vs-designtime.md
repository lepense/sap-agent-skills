# Runtime vs design-time

CAP splits into two packages. Understanding which is which prevents version confusion during
upgrades.

## @sap/cds — the runtime

- The **application runtime**: services, handlers, `cds.ql`, the server.
- Declared in your app's `package.json` under **`dependencies`** and **pinned**.
- Controls production behavior — this is the version that ships.

```json
"dependencies": {
  "@sap/cds": "^10.0.0"
}
```

## @sap/cds-dk — the design-time toolkit

- The **`cds` CLI**: `init`, `add`, `build`, `deploy`, `import`, `upgrade`, `watch`.
- Installed **globally** (`npm i -g @sap/cds-dk`) and/or as a **`devDependency`** for
  reproducible builds/CI.

```json
"devDependencies": {
  "@sap/cds-dk": "^10.0.0"
}
```

## Keep them aligned

- Upgrade **both** to the same major together; a `cds-dk` far ahead of the runtime can generate
  artifacts the runtime doesn't understand (and vice versa).
- In CI, prefer a **local** `@sap/cds-dk` (devDependency + `npx cds`) over relying on a global
  install, so builds are reproducible.

## Guidance

Pin `@sap/cds` (runtime) in `dependencies`; keep `@sap/cds-dk` (tooling) current in
`devDependencies`/global; bump them together during an upgrade.
