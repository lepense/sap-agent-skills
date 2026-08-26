# Brokers and configuration

The `messaging` service under `cds.requires` abstracts the broker; your emit/subscribe code
stays the same across brokers. The `kind` selects the implementation.

## Kinds

| kind | Broker / use |
|---|---|
| `enterprise-messaging` / `enterprise-messaging-shared` | **SAP Event Mesh** (enterprise messaging) |
| `event-broker` | **SAP Cloud Application Event Hub** |
| `local-messaging` | in-process events within one CAP app (no broker) |
| `file-based-messaging` | local dev across processes via a file (no broker) |

## Configuration

```jsonc
"cds": {
  "requires": {
    "messaging": {
      "kind": "enterprise-messaging-shared",
      "format": "cloudevents",
      // default topic prefixes for CloudEvents on Event Mesh:
      "publishPrefix": "$namespace/ce/",
      "subscribePrefix": "+/+/+/ce/",
      "[development]": { "kind": "file-based-messaging" }
    }
  }
}
```

- **Per-profile:** develop with `file-based-messaging`/`local-messaging`; use the real broker
  in `production`/`hybrid`.
- **`format: 'cloudevents'`** — recommended for interoperability (see cloudevents.md).
- **Prefixes** (Event Mesh) build the technical topic names; keep them consistent with the
  producing system (e.g. S/4) so topics match.

## Guidance

Pick `enterprise-messaging`/`event-broker` for production per your BTP setup; keep the inner
loop broker-free with `file-based-messaging`. Don't scatter broker specifics through code — it
all lives in this one config block.
