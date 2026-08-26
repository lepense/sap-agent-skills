# Receiving SAP S/4HANA events

CAP can subscribe to business events emitted by SAP S/4HANA (Cloud) — e.g. BusinessPartner
changed — via SAP Event Mesh or SAP Cloud Application Event Hub.

## Configure the broker

```jsonc
// SAP Event Mesh
"messaging": {
  "kind": "enterprise-messaging-shared",
  "format": "cloudevents",
  "subscribePrefix": "+/+/+/ce/"
}
```

```jsonc
// SAP Cloud Application Event Hub
"messaging": { "kind": "event-broker" }
```

Ensure the Event Mesh subscription pattern is broad enough (e.g. `+/+/+/ce/*`) so S/4 topics
match; keep namespaces consistent with the S/4 system.

## Import the event's data model (optional)

Download the event/API metadata from the SAP Business Accelerator Hub and `cds import` it to
get typed payloads and to declare the event in your model.

## Subscribe

```js
const messaging = await cds.connect.to('messaging')
messaging.on('sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1', async (msg) => {
  const { BusinessPartner } = msg.data
  // e.g. refresh a local replica or trigger a follow-up process
})
```

## Delivery notes

- S/4 events are **at-least-once** — make handlers idempotent.
- Cloud Application Event Hub uses a **webhook** + IAS for secure delivery; wire the binding in
  deployment (see deployment-binding.md). For Java, add `cds-feature-event-hub` and the
  `/messaging/v1.0/eb` webhook path.

## Guidance

Match the broker/topic conventions to the S/4 system, subscribe to the exact event `type`, and
handle events idempotently. Use CloudEvents formatting throughout.
