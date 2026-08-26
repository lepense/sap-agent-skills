---
name: cap-deploy
description: Deploy SAP CAP applications to SAP BTP — production facets, MTA on Cloud Foundry, Kyma/Kubernetes, SAP HANA, XSUAA/approuter, hybrid testing, multitenancy, and CI/CD.
license: MIT
---

# CAP deployment

## What this covers

Taking a SAP CAP app from local development to **SAP BTP** production: adding production
**facets**, building deployables, deploying via **MTA to Cloud Foundry** or **Helm to
Kyma/Kubernetes**, wiring **SAP HANA**, **XSUAA** and an **approuter**, **hybrid** testing
against real services, **multitenancy**, and **CI/CD**. Prefer the `cds add` facets and
`cds build`/`cds up` toolchain over hand-writing descriptors. Detail lives in
[references/](references).

## Prepare for production (run once per project)

Local dev uses in-memory SQLite + mocked auth; production needs real services:

```sh
cds add hana          # SAP HANA persistence
cds add xsuaa         # authentication/authorization
cds compile --to xsuaa   # (re)generate xs-security.json after auth-annotation changes
cds add mta           # Cloud Foundry (MTA)   — or:  cds add kyma  (Kubernetes/Helm)
cds add approuter     # app router / UI serving (or portal / workzone)
cds add multitenancy  # optional: SaaS multitenancy (adds the MTX sidecar)
```

`cds add <facet>` updates `package.json` and generates descriptors (`mta.yaml`,
`xs-security.json`, Helm charts). See [references/prepare-production.md](references/prepare-production.md).

## Build

```sh
cds build --production        # generate deployables under gen/ (gen/srv, gen/db)
cd gen/srv && npx cds-serve    # optional: smoke-test the built server locally
```

## Deploy to Cloud Foundry (MTA)

```sh
npm i -g mbt          # Cloud MTA Build Tool (once)
mbt build             # produce mta_archives/<app>_<version>.mtar
cf deploy mta_archives/<app>_<version>.mtar
# or the CAP convenience:
cds up                # build + deploy (MTA when mta.yaml is present)
```

The MTA bundles the CAP service (`nodejs`/`java`), the HANA deployer (`hdb`), the approuter,
and any HTML5 apps, binding them to HANA (`hdi-shared`) and XSUAA. See
[references/mta-cloud-foundry.md](references/mta-cloud-foundry.md).

## Deploy to Kyma / Kubernetes (Helm)

```sh
cds add kyma          # interactive: cluster domain + container registry; generates gen/chart
cds up -2 k8s         # build images + deploy via Helm (or: cds up --to k8s)
cds up -2 k8s -n <namespace>
```

Requires Docker, `kubectl`/`helm`/`pack`, a kubeconfig, and registry access. `cds up` defaults
to k8s when Helm resources exist and there is no `mta.yaml`. See
[references/kyma-kubernetes.md](references/kyma-kubernetes.md).

## Database (SAP HANA)

Production persistence is SAP HANA Cloud via an HDI container (`hdi-shared`). The `hdb`
deployer module deploys the schema; the service binds to it. See
[references/hana-deployment.md](references/hana-deployment.md).

## Security and app router

XSUAA provides tokens/roles (`xs-security.json` from your CDS roles); the **approuter** (or
SAP Build Work Zone) handles login, token flow, and serves UIs. IAS is an alternative
(`cds add ias`). See [references/security-approuter.md](references/security-approuter.md).

## Hybrid testing

Run locally against **real** cloud services before deploying:

```sh
cds bind -a <app>                       # bind to a CF service instance
cds watch --profile hybrid              # Node.js
mvn cds:watch -Dspring-boot.run.profiles=hybrid   # Java (from srv/)
cds bind --exec -- node --test          # tests against bound cloud services
```

See [references/hybrid-testing.md](references/hybrid-testing.md).

## Multitenancy and CI/CD

Multitenant SaaS adds the **MTX sidecar** and `saas-registry`; deploy provider + subscriber
flows. Automate build/deploy in a pipeline. See
[references/multitenancy-deploy.md](references/multitenancy-deploy.md) and
[references/cicd.md](references/cicd.md).

## Anti-patterns (Don't)

- **Don't** hand-write `mta.yaml`/Helm from scratch — generate with `cds add`, then adjust.
- **Don't** deploy the raw project — deploy `cds build --production` output.
- **Don't** ship dev config — no in-memory SQLite or mocked auth in production profiles.
- **Don't** forget `cds compile --to xsuaa` after changing `@requires`/`@restrict`.
- **Don't** hardcode credentials/destinations — bind services; use `cds bind` for hybrid.
- **Don't** skip health probes — keep liveness/readiness endpoints for CF/Kyma.

## References

- [references/prepare-production.md](references/prepare-production.md) — facets & build.
- [references/mta-cloud-foundry.md](references/mta-cloud-foundry.md) — MTA on CF.
- [references/kyma-kubernetes.md](references/kyma-kubernetes.md) — Kyma/Helm.
- [references/hana-deployment.md](references/hana-deployment.md) — SAP HANA / HDI.
- [references/security-approuter.md](references/security-approuter.md) — XSUAA/approuter/IAS.
- [references/hybrid-testing.md](references/hybrid-testing.md) — `cds bind` hybrid runs.
- [references/multitenancy-deploy.md](references/multitenancy-deploy.md) — SaaS deployment.
- [references/cicd.md](references/cicd.md) — pipelines.
