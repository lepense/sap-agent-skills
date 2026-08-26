---
description: Consume an imported remote service and expose it through a CAP mashup.
---

Wire consumption of an already-imported remote service. Steps:

1. **Connect:** in the service implementation, `const svc = await cds.connect.to('<Required>')`
   and grab `svc.entities`.
2. **Expose (mashup):** in `.cds`, project the remote entity into your own service
   (`@readonly entity Suppliers as projection on external.A_BusinessPartner { ... }`) and/or
   add local entities that associate to it. See `templates/travel-service.cds`.
3. **Delegate reads:** `this.on('READ', '<RemoteEntity>', req => svc.run(req.query))` so
   filters/selects push down to the remote system. See `templates/travel-service.js`.
4. **Enrich local data:** in an `after` handler, collect keys and issue **one batched** remote
   read (`where { Key: ids }`) — never call the remote service inside a loop (N+1).
5. **Be resilient:** wrap remote calls in try/catch; decide fail vs degrade; set timeouts.
6. **Test with mocks:** use `cds.test` (in-process mock) to assert the mashup/enrichment logic
   without the real system.

Always use `cds.connect.to` + CQL (no hand-rolled HTTP), push queries down, and batch lookups.
