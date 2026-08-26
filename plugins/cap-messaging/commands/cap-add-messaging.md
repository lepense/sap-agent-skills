---
description: Add event-driven messaging to a CAP project (broker config + outbox).
---

Wire messaging into the user's CAP app. Steps:

1. **Choose the broker** for production: SAP Event Mesh (`enterprise-messaging` /
   `enterprise-messaging-shared`) or SAP Cloud Application Event Hub (`event-broker`).
2. **Configure `cds.requires.messaging`** with the `kind`, `format: 'cloudevents'`, and a
   `[development]` override to `file-based-messaging` so the inner loop needs no broker. Use
   `templates/package-messaging.json`.
3. **Enable the persistent outbox** (`cds.requires.outbox.kind = persistent-outbox`) for
   reliable, transaction-aligned delivery.
4. **Declare events** in the service (`event <Name> { ... }`, optional `@topic`) — see
   `templates/events.cds`.
5. **Local test:** run with `file-based-messaging`; emit and subscribe across processes without
   a broker.
6. **Deployment:** bind the messaging service instance in `mta.yaml`/Helm (Event Hub needs a
   webhook + IAS). Use `templates/mta-messaging.yaml`.

Keep code broker-agnostic (all specifics in `cds.requires`), use CloudEvents, and design
subscribers to be idempotent (at-least-once delivery).
