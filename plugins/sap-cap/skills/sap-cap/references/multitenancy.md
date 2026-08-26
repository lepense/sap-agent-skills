# Multitenancy

CAP supports SaaS multitenancy where one application instance serves many tenants with
isolated data. Enable it with a facet; the framework handles tenant-aware persistence and
onboarding.

## Enable

```sh
cds add multitenancy      # adds the MTX sidecar + config
cds add hana,xsuaa        # production persistence + auth (required for MT)
cds add mta               # Cloud Foundry deployment (or: cds add kyma)
cds up
```

`cds add multitenancy` wires the **MTX** (Model Transaction eXtensions) services used for
tenant provisioning, extensibility, and feature toggles.

## How isolation works

- Each request carries a tenant (`req.tenant` / event context). CAP scopes queries to that
  tenant automatically — handlers use the normal CQN API and stay tenant-agnostic.
- Each tenant gets its own HANA HDI container (schema-level isolation), provisioned during
  subscription.

## Onboarding / subscription

A `saas-registry` service instance (declared in `mta.yaml`) registers the app in the BTP
SaaS provisioning flow. Subscribers subscribe via the BTP cockpit; CAP's MTX handles
per-tenant database provisioning. In Cloud Foundry, map a subscriber route, e.g.:

```sh
cf map-route <app> <domain> --hostname <subscriber-subdomain>-<app>
```

## Extensibility

MTX enables tenant-specific extensions (additional fields/entities) without redeploying the
base app. Keep the base model clean; let tenants extend through the sanctioned MTX flow
rather than branching the model per customer.
