# Consuming a remote service

Connect to the required service and query it with the same CDS query API you use for local
data — CAP translates CQL to the remote OData calls.

## Connect and query

```js
const cds = require('@sap/cds')

module.exports = class TravelService extends cds.ApplicationService {
  async init() {
    const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
    const { A_BusinessPartner } = bupa.entities

    this.on('READ', 'Suppliers', async (req) => {
      // delegate the read to the remote service, passing the query through
      return bupa.run(req.query)
    })

    this.after('READ', 'Travels', async (travels) => {
      const ids = [...new Set([travels].flat().map(t => t.supplier_ID).filter(Boolean))]
      if (!ids.length) return
      const names = await bupa.run(
        SELECT.from(A_BusinessPartner).columns('BusinessPartner', 'BusinessPartnerName')
          .where({ BusinessPartner: ids })   // batched — avoids N+1
      )
      const byId = Object.fromEntries(names.map(n => [n.BusinessPartner, n.BusinessPartnerName]))
      for (const t of [travels].flat()) t.supplierName = byId[t.supplier_ID]
    })
  }
}
```

## Passing the query through

For a projection over a remote entity, forward `req.query` to `service.run(req.query)` so
`$filter`/`$select`/`$top` are pushed down to the remote system instead of fetching everything.

## Java

In CAP Java, obtain the service via the service catalog / `@Autowired CdsService` and run CQN
statements against it — the same push-down principles apply.

## Guidance

Always use `cds.connect.to(...)` + CQL (never a hand-rolled HTTP client), push filters down to
the remote system, and batch lookups (`where … in [...]`) to avoid N+1 remote round-trips.
