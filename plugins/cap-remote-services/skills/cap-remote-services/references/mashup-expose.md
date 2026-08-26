# Mashups: exposing and combining remote data

A mashup exposes remote data through your own service, optionally combined with local
entities, so consumers see one coherent OData service.

## Project a remote entity

Declare a local view of the remote entity and expose it:

```cds
using { API_BUSINESS_PARTNER as external } from '../srv/external/API_BUSINESS_PARTNER';

service TravelService {
  // expose selected remote fields as your own entity
  @readonly entity Suppliers as projection on external.A_BusinessPartner {
    key BusinessPartner as ID,
    BusinessPartnerName as name,
    BusinessPartnerCategory as category
  }
}
```

Delegate its reads to the remote service (see [consume-service.md](consume-service.md)):

```js
const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
this.on('READ', 'Suppliers', req => bupa.run(req.query))
```

## Combine with local data

Add a local entity that references the remote one:

```cds
entity Travels : cuid, managed {
  description : String;
  supplier    : Association to Suppliers;   // points at the mashed-up remote entity
}
```

Enrich local reads with remote lookups in an `after` handler, batching by key to avoid N+1.

## Replicating vs live

- **Live delegation** (above) — always current, but each read hits the remote system.
- **Replication** — periodically copy remote data into a local entity for performance/offline;
  more complex (sync + staleness). Choose live first; replicate only when latency/availability
  demands it.

## Guidance

Expose only the remote fields you need, push queries down to the remote service, and keep the
mashup service the single façade your UI/consumers talk to.
