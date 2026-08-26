# Reuse packages (cds export)

For **CAP-to-CAP** integration, prefer a lossless reuse package over exchanging EDMX. `cds
export` generates a ready-to-use API client package from a CDS service definition.

## Export

```sh
# given srv/data-service.cds defining FlightsService
cds export srv/data-service.cds
# -> ./apis/data-service  (a CAP reuse package: lossless CDS model + client)
```

## Publish and consume

```sh
# publish the generated package
npm publish ./apis/data-service

# in a consuming CAP project
npm add @capire/xflights-data
```

The consumer gets the original CDS model (annotations, associations) intact — no EDMX
round-trip loss — and can `cds.connect.to(...)` the exported service.

## EDMX vs reuse package

- **EDMX (`cds import`)** — the interoperable choice for non-CAP / SAP-standard APIs (e.g. S/4
  APIs from the Business Accelerator Hub).
- **Reuse package (`cds export`)** — the better choice when both provider and consumer are CAP
  projects; preserves the full CDS model.

## Guidance

Use `cds import` for external OData APIs; use `cds export` reuse packages to share a CAP
service with other CAP teams losslessly. (Check the CAP release notes for the current
GA/beta status of `cds export` and pin accordingly.)
