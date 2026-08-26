---
description: Subscribe to a CAP or external (S/4HANA) event with an idempotent handler.
---

Add an event subscription to the user's CAP app. Steps:

1. **Pick the source:**
   - **CAP declared event:** `const svc = await cds.connect.to('<Service>'); svc.on('<Event>',
     handler)`.
   - **External/S4 event type:** `const m = await cds.connect.to('messaging'); m.on('<type>',
     handler)` (e.g. `sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1`).
   See `templates/subscriber.js`.
2. **Read the payload** from `msg.data` (CloudEvents format).
3. **Make the handler idempotent:** brokers deliver **at-least-once**, so use the event key to
   no-op on duplicates (upsert, or check a processed marker). Reprocessing must be harmless.
4. **Handle errors safely:** a throwing handler may cause redelivery — keep it retry-safe and
   route poison messages aside rather than looping.
5. **Test with mocks:** run with `file-based-messaging` (or `cds.test`) and emit the event to
   confirm the handler reacts correctly, including a duplicate delivery.

Subscribe by declared event for CAP-to-CAP and low-level for external types; always design for
at-least-once with idempotent, retry-safe handlers.
