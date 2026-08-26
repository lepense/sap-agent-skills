# Kyma / Kubernetes (Helm)

CAP deploys to Kyma (SAP's managed Kubernetes) via generated **Helm charts**.

## Add Kyma scaffolding

```sh
cds add kyma
```

Interactive — prompts for the **Kyma cluster domain** and your **container registry**. It
generates a Helm chart under `gen/chart` and probe-related values (`@sap/cds-dk` populates
liveness/readiness).

## Prerequisites

- Docker daemon running.
- `kubectl`, `helm`, and `pack` installed.
- A kubeconfig at `$HOME/.kube/config` for the target cluster.
- Access to a container image registry.

## Build and deploy

```sh
cds up -2 k8s                 # build images + deploy via Helm
cds up -2 k8s -n <namespace>  # deploy into a specific namespace
cds up --to k8s               # equivalent explicit form
```

When the project contains Helm resources and **no** `mta.yaml`, `cds up` defaults to k8s, so
`-2 k8s` becomes optional.

## What happens

`cds up -2 k8s` builds container images (service, HANA deployer, approuter), pushes them to
the configured registry, and runs `helm upgrade --install` with the generated chart —
creating/updating the deployments, services, and API rules in the cluster.

## Adjusting

Edit `gen/chart/values.yaml` (or a values override) for image names, replica counts,
resources, and probe endpoints. Bind BTP services (HANA, XSUAA) via the SAP BTP service
operator / Kyma service bindings referenced in the chart.
