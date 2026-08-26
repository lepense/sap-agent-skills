# CloudEvents

**CloudEvents** is the CNCF standard envelope for events. CAP can format messages as
CloudEvents so they interoperate with SAP systems (S/4HANA, Event Mesh, Event Hub) and other
CloudEvents consumers.

## Enable

```jsonc
"cds": {
  "requires": {
    "messaging": {
      "kind": "enterprise-messaging-shared",
      "format": "cloudevents"
    }
  }
}
```

With `format: 'cloudevents'`, CAP prefills the CloudEvents context attributes when emitting
(e.g. `type`, `source`, `id`, `time`, `datacontenttype`) and reads them on receipt; your
payload is available in `msg.data`.

## Topics and types

- The CloudEvents `type` corresponds to the event/topic name; SAP systems use dotted,
  versioned types like `sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1`.
- Event Mesh topic prefixes (`publishPrefix`/`subscribePrefix`) build the technical topic
  around the CloudEvents type — keep them consistent with the producer.

## Interop

Because the envelope is standard, CAP producers/consumers interoperate with non-CAP systems
that speak CloudEvents. This is the recommended format for SAP eventing.

## Guidance

Turn on `format: 'cloudevents'` for anything crossing system boundaries (especially S/4
events). Rely on CAP to fill the envelope; put your data in the payload and read it from
`msg.data`.
