---
name: cap-remote-services
description: Consume external services in SAP CAP — import OData APIs, configure remote services with destinations, query with cds.connect.to, mock for local dev, build mashups, and add resilience.
license: MIT
---

# CAP remote services

## What this covers

Consuming **external services** (e.g. SAP S/4HANA APIs, other CAP apps, any OData service)
from a CAP application: **importing** the API, **configuring** the remote service and its
**destination**, **querying** it with the same CDS query API you use locally, **mocking** it
for fast local development, building **mashups** that combine remote and local data, and
adding **resilience**. Prefer CAP's declarative service consumption over hand-written HTTP
clients. Detail lives in [references/](references).

## Importing an API

Download the OData metadata (EDMX) from the SAP Business Accelerator Hub (or the provider),
then import it:

```sh
cds import ~/Downloads/API_BUSINESS_PARTNER.edmx          # -> srv/external/*.csn (+ .edmx)
cds import ~/Downloads/API_BUSINESS_PARTNER.edmx --as cds  # human-readable .cds instead
```

`cds import` places the artifacts under `srv/external/` and registers the service in
`package.json`. See [references/import-apis.md](references/import-apis.md).

## Configuring the remote service

The imported service appears under `cds.requires`; point it at the real system via a
**destination** (BTP) or a URL/credentials for local runs:

```jsonc
"cds": {
  "requires": {
    "API_BUSINESS_PARTNER": {
      "kind": "odata-v2",             // or odata / odata-v4
      "model": "srv/external/API_BUSINESS_PARTNER",
      "[production]": { "credentials": { "destination": "S4HANA", "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER" } }
    }
  }
}
```

See [references/configure-service.md](references/configure-service.md) and
[references/destinations.md](references/destinations.md).

## Consuming it

Connect and query with the normal CDS query API — no manual HTTP:

```js
const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
const { A_BusinessPartner } = bupa.entities
const partners = await bupa.run(SELECT.from(A_BusinessPartner).where({ BusinessPartnerCategory: '1' }))
```

See [references/consume-service.md](references/consume-service.md).

## Mocking for local development

Don't call the real system in the inner loop:

- **In-process:** `cds watch` auto-mocks imported APIs in the shared in-memory DB.
- **Separate process:** `cds mock apis/<api>.cds` runs the API as its own mock server, and the
  consumer `cds watch` connects to it (more realistic).

See [references/mocking.md](references/mocking.md).

## Mashups

Expose remote data through your own service — projections over the remote entity, or combine
it with local entities (e.g. a local `Travels` entity with an association to a remote
`BusinessPartner`). Delegate reads to the remote service in an `on READ` handler when needed.
See [references/mashup-expose.md](references/mashup-expose.md).

## Resilience

Remote calls can fail or be slow. Handle errors, set timeouts, avoid N+1 remote reads (batch
with `$expand`/`where … in`), and degrade gracefully. See
[references/resilience.md](references/resilience.md).

## Reuse packages (cds export)

Instead of exchanging EDMX, a CAP service can be exported as a **reuse/API-client npm
package** (`cds export`) for lossless consumption by other CAP projects. See
[references/reuse-packages.md](references/reuse-packages.md).

## Anti-patterns (Don't)

- **Don't** hand-write HTTP/axios clients — import the API and use `cds.connect.to` + CQL.
- **Don't** call the real remote system in unit tests / inner loop — mock it.
- **Don't** hardcode URLs/credentials — use a **destination** (or bound service), per profile.
- **Don't** do N+1 remote reads in a loop — batch or `$expand`.
- **Don't** ignore remote failures — handle errors and timeouts, and surface clear messages.

## References

- [references/import-apis.md](references/import-apis.md) — `cds import` and artifacts.
- [references/configure-service.md](references/configure-service.md) — `cds.requires` config.
- [references/consume-service.md](references/consume-service.md) — querying remote services.
- [references/mocking.md](references/mocking.md) — in-process and separate-process mocks.
- [references/mashup-expose.md](references/mashup-expose.md) — expose/combine remote data.
- [references/destinations.md](references/destinations.md) — BTP destinations & auth.
- [references/resilience.md](references/resilience.md) — errors, timeouts, batching.
- [references/reuse-packages.md](references/reuse-packages.md) — `cds export` reuse packages.
