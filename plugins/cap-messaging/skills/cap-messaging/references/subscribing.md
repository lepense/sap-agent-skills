# Subscribing to events

Handle incoming events with `on` handlers — either on a connected CAP service (declared
events) or on the low-level `messaging` service (any broker topic).

## Declared events (CAP-to-CAP)

Connect to the emitting service and subscribe by event name:

```js
module.exports = async function () {
  const reviews = await cds.connect.to('ReviewsService')
  reviews.on('Reviewed', async (msg) => {
    const { subject, rating } = msg.data
    await UPDATE('Books').set({ rating }).where({ ID: subject })
  })
}
```

## Low-level / external event types

Subscribe directly to a broker topic / external event type (e.g. an S/4 event):

```js
const messaging = await cds.connect.to('messaging')
messaging.on('sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1', async (msg) => {
  const { BusinessPartner } = msg.data
  // react to the S/4 change
})
```

The handler receives a message with the payload in `msg.data` (CloudEvents format). CAP
manages the topic/queue subscriptions for you.

## Idempotency (important)

Brokers deliver **at least once** — the same event may arrive more than once. Make handlers
**idempotent**: use the event's key to no-op on duplicates (e.g. upsert, or check a processed
marker) so reprocessing is harmless.

## Errors

If a handler throws, the message may be redelivered. Keep handlers safe to retry; move
poison messages aside rather than looping forever.

## Guidance

Subscribe by declared event for CAP-to-CAP, low-level for external types. Always design for
at-least-once: idempotent, retry-safe handlers.
