# Node.js / JDK requirements

Major CAP releases raise the minimum runtime. Align local, CI, and deploy runtimes **before**
bumping `@sap/cds`, or the upgrade fails at the platform level.

## Node.js for CDS 10

| Version | Status | CDS 10 |
|---|---|---|
| Node.js v20 | End of life (April 2026) | **Not supported** |
| Node.js v22 | Maintenance LTS | **Minimum required** |
| Node.js v24 | Active LTS (May 2026) | **Recommended** |
| Node.js v26 | Active LTS (Oct 2026) | Usable in dev / tested |

So for CDS 10, move to **Node.js 22+** (24 recommended) everywhere.

## Where to change the runtime

- **Local:** install the target Node (nvm/fnm) and re-`npm install`.
- **CI:** update `actions/setup-node` `node-version` (and any test matrix).
- **Cloud Foundry:** the buildpack picks a Node version — pin it via `engines.node` in
  `package.json` and/or the buildpack config.
- **Kyma:** the base image / builder must provide the target Node.

```json
"engines": { "node": ">=22" }
```

## JDK (CAP Java)

CAP Java majors similarly require a minimum JDK (e.g. modern LTS such as JDK 17/21 depending on
the release). Check the release's requirements and update the build (Maven toolchain) and
runtime image accordingly.

## Guidance

Treat the runtime bump as **step one** of a major upgrade: raise Node/JDK across local, CI, and
deploy first, verify the app still starts, then upgrade `@sap/cds`.
