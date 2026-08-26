---
name: cap-messaging
description: Build event-driven SAP CAP apps — declare events, emit and subscribe, use SAP Event Mesh / Cloud Application Event Hub, CloudEvents, the transactional outbox, and S/4HANA events.
license: MIT
---

# CAP messaging

## What this covers

Event-driven CAP: **declaring** events, **emitting** and **subscribing**, connecting to a
**broker** (SAP Event Mesh, SAP Cloud Application Event Hub, or local dev messaging), using
**CloudEvents**, ensuring reliable delivery with the **transactional outbox**, and receiving
**S/4HANA** events. Prefer declared events + the `messaging` service over ad-hoc HTTP calls
between services. Detail lives in [references/](references).

## Brokers and configuration

Configure a `messaging` service under `cds.requires`; the `kind` selects the broker:

```jsonc
"cds": {
  "requires": {
    "messaging": {
      "kind": "enterprise-messaging-shared",   // SAP Event Mesh
      "format": "cloudevents",
      "[development]": { "kind": "file-based-messaging" }  // local dev, no broker
    }
  }
}
```

Common kinds: `enterprise-messaging` / `enterprise-messaging-shared` (SAP Event Mesh),
`event-broker` (SAP Cloud Application Event Hub), `local-messaging` / `file-based-messaging`
(development). See [references/brokers-config.md](references/brokers-config.md).

## Declaring events

Model events in the service, like actions but fire-and-forget:

```cds
service ReviewsService {
  event Reviewed {
    subject : String;
    rating  : Decimal;
  }
}
```

Control the broker topic with `@topic`:

```cds
@topic: 'my.custom.topic'
event Reviewed { subject: String; rating: Decimal; }
```

See [references/declaring-events.md](references/declaring-events.md).

## Emitting

```js
const srv = await cds.connect.to('ReviewsService')
await srv.emit('Reviewed', { subject: '201', rating: 4.5 })
```

Emitting through a service uses the **outbox** by default in production, so the event is only
sent if the transaction commits. See [references/emitting.md](references/emitting.md).

## Subscribing

```js
// to your own / another CAP service's declared event
this.on('Reviewed', (msg) => {
  const { subject, rating } = msg.data
  // update aggregates, etc.
})

// low-level: subscribe directly to an external event type (e.g. S/4)
const messaging = await cds.connect.to('messaging')
messaging.on('sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1', (msg) => {
  const { BusinessPartner } = msg.data
})
```

See [references/subscribing.md](references/subscribing.md).

## CloudEvents

Set `format: 'cloudevents'` so CAP fills CloudEvents headers automatically — the interoperable
format for SAP eventing. See [references/cloudevents.md](references/cloudevents.md).

## Reliability: the transactional outbox

The **persistent outbox** stores the emit in the same DB transaction as your data changes, and
a background process delivers it after commit — so you never send an event for a rolled-back
change, and delivery survives restarts. See [references/outbox.md](references/outbox.md).

## S/4HANA events

Bind an Event Mesh / Event Hub instance that receives S/4 events, then subscribe to the S/4
event type (declared or low-level). See [references/s4-events.md](references/s4-events.md).

## Deployment

Bind the messaging service instance (Event Mesh / Event Hub) in `mta.yaml`/Helm; Event Hub
uses a webhook + IAS. See [references/deployment-binding.md](references/deployment-binding.md).

## Anti-patterns (Don't)

- **Don't** make synchronous HTTP calls between services for things that should be events.
- **Don't** emit outside a transaction when the event must reflect committed data — use the
  outbox (default via `srv.emit`).
- **Don't** hardcode broker topics in code — model events and use `@topic` for custom routing.
- **Don't** assume exactly-once — design subscribers to be **idempotent** (at-least-once).
- **Don't** call a real broker in the inner loop — use `file-based-messaging` locally.
- **Don't** block the emitter on subscriber processing — events are fire-and-forget.

## References

- [references/brokers-config.md](references/brokers-config.md) — broker kinds & config.
- [references/declaring-events.md](references/declaring-events.md) — CDS events & `@topic`.
- [references/emitting.md](references/emitting.md) — emitting events.
- [references/subscribing.md](references/subscribing.md) — subscribing (own & external).
- [references/outbox.md](references/outbox.md) — transactional outbox.
- [references/cloudevents.md](references/cloudevents.md) — CloudEvents format.
- [references/s4-events.md](references/s4-events.md) — receiving S/4HANA events.
- [references/deployment-binding.md](references/deployment-binding.md) — deploy & binding.
