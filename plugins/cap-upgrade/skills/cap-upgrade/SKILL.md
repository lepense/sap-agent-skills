---
name: cap-upgrade
description: Upgrade SAP CAP projects safely — the cds upgrade tool, runtime vs design-time versions, Node.js/JDK requirements, major-release migration, Java BOM, and regression testing.
license: MIT
---

# CAP upgrade

## What this covers

Keeping a CAP project current and upgrading across major releases without breaking it:
checking versions, running the **`cds upgrade`** assistant, understanding **runtime vs
design-time** dependencies, meeting **Node.js/JDK** requirements, following the **major-release
migration** process, the **Java BOM**, **dependency hygiene**, and **regression testing** the
upgrade. Upgrade deliberately, guided by the migration notes and a green test suite. Detail
lives in [references/](references).

## Check where you are

```sh
cds version          # installed @sap/cds-dk + Node/npm
npm outdated         # which deps have newer versions
npm ls @sap/cds      # the runtime version actually resolved
```

See [references/check-versions.md](references/check-versions.md).

## The cds upgrade assistant

```sh
npm i -g @sap/cds-dk    # latest design-time toolkit
cds upgrade             # scan the project for breaking changes + get migration guidance
```

`cds upgrade` reports findings and suggested steps for moving to the current major (e.g. CDS
10). Treat its output as a checklist, not an automatic rewrite. See
[references/cds-upgrade-tool.md](references/cds-upgrade-tool.md).

## Runtime vs design-time

- **`@sap/cds`** — the **runtime**, pinned in your app's `package.json` `dependencies`; it
  controls production behavior.
- **`@sap/cds-dk`** — the **design-time** toolkit (`cds` CLI: init/add/build/deploy), installed
  globally and/or as a `devDependency`.

Bump them together and keep the runtime version pinned. See
[references/runtime-vs-designtime.md](references/runtime-vs-designtime.md).

## Node.js / JDK requirements

Major CAP releases raise the minimum runtime. For **CDS 10**: Node.js **v22 is the minimum**
(v20 reached end of life April 2026 and is not supported), **v24 recommended**. Align your
local, CI, and deploy runtimes before upgrading. See
[references/node-jdk-requirements.md](references/node-jdk-requirements.md).

## Major-release migration process

1. Read the **migration guide** / release notes for the target major.
2. Ensure Node/JDK meet the new minimum.
3. Bump `@sap/cds` (+ `@sap/cds-dk`) and plugins together; `npm install`.
4. Run `cds upgrade` and address each finding.
5. `cds build` and run the **full test suite**; fix breakages.
6. Verify in a **hybrid** run before deploying.

See [references/major-upgrade-process.md](references/major-upgrade-process.md).

## Java

CAP Java centralizes versions in the **`cds-services-bom`** (`cds.services.version`
property). Prefer `npm ci` (via the `cds-maven-plugin`) over the deprecated `install-cdsdk`
goal. See [references/java-upgrade.md](references/java-upgrade.md).

## Dependency hygiene

Pin the runtime, keep tooling current, and automate updates (Dependabot/Renovate) with CI
gating so upgrades are small and safe. See [references/dependency-hygiene.md](references/dependency-hygiene.md)
and [references/regression-testing.md](references/regression-testing.md).

## Anti-patterns (Don't)

- **Don't** jump majors without reading the migration guide and running `cds upgrade`.
- **Don't** upgrade `@sap/cds` while ignoring the Node.js/JDK minimum — align runtimes first.
- **Don't** leave the runtime unpinned (`*`/`latest`) — pin `@sap/cds` for reproducibility.
- **Don't** upgrade without a green regression suite to prove nothing broke.
- **Don't** bump everything blindly in one giant PR — upgrade in reviewable steps.
- **Don't** deploy an upgrade you haven't validated in a hybrid run.

## References

- [references/check-versions.md](references/check-versions.md) — inspecting versions.
- [references/cds-upgrade-tool.md](references/cds-upgrade-tool.md) — the `cds upgrade` assistant.
- [references/runtime-vs-designtime.md](references/runtime-vs-designtime.md) — `@sap/cds` vs `@sap/cds-dk`.
- [references/node-jdk-requirements.md](references/node-jdk-requirements.md) — runtime requirements.
- [references/major-upgrade-process.md](references/major-upgrade-process.md) — step-by-step.
- [references/java-upgrade.md](references/java-upgrade.md) — CAP Java / BOM.
- [references/dependency-hygiene.md](references/dependency-hygiene.md) — pinning & automation.
- [references/regression-testing.md](references/regression-testing.md) — proving the upgrade.
