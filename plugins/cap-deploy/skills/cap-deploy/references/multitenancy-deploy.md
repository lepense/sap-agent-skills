# Multitenancy deployment (SaaS)

A multitenant CAP app serves many tenants from one deployment, with per-tenant data isolation.
Deployment adds the **MTX sidecar** and a **SaaS registry**.

## Enable and deploy

```sh
cds add multitenancy       # adds the MTX sidecar + config
cds add hana,xsuaa         # required production services
cds add mta                # (or: cds add kyma)
cds up                     # build + deploy provider account
```

`cds add multitenancy` wires the **MTX** services (Model Transaction eXtensions) used for
tenant provisioning, extensibility, and feature toggles.

## What gets deployed

- The **MTX sidecar** module (handles tenant onboarding/provisioning).
- A **`saas-registry`** resource that registers the app in BTP's SaaS provisioning flow.
- The main service + HANA deployer + XSUAA + approuter, as in a single-tenant deploy.

## Subscription flow

- Subscribers subscribe via the **BTP cockpit**; MTX provisions a per-tenant HDI container
  (schema-level isolation).
- In Cloud Foundry, map a subscriber route, e.g.:

```sh
cf map-route <app> <domain> --hostname <subscriber-subdomain>-<app>
```

The `mta.yaml` can template the SaaS `appName` with `${org}`/`${space}`.

## Guidance

- Deploy the provider account first; onboarding provisions subscriber tenants on demand.
- Keep the base model clean; let tenants extend through the sanctioned MTX extensibility flow
  rather than per-customer forks.
- Test onboarding in a **hybrid** setup (sidecar + app) before going live.
