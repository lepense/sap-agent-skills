---
description: Emit a domain event from a CAP service via the transactional outbox.
---

Add event emission to the user's CAP service. Steps:

1. **Declare the event** in the service model if not already: `event <Name> { ...typed
   payload... }`; add `@topic` for a custom broker topic. Keep the payload lean (keys +
   essentials).
2. **Emit from a handler:** in an `after`/`on` handler for the triggering operation, call
   `this.emit('<Name>', payload)`. Emitting through the service uses the **outbox**, so the
   event is delivered only if the transaction commits. See `templates/reviews-service.js`.
3. **Low-level emit (interop):** for a raw broker topic without a declaration, use
   `const m = await cds.connect.to('messaging'); await m.emit('<topic>', payload)`.
4. **Verify locally:** with `file-based-messaging`, run the app and a subscriber and confirm
   the event flows; check the outbox delivers after commit and not on rollback.

Emit inside the transaction that makes the change, keep the payload small, and rely on the
persistent outbox for reliability. Events are fire-and-forget — don't await subscriber work.
