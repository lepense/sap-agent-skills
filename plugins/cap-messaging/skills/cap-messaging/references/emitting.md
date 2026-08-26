# Emitting events

Emit an event through the owning service; CAP publishes it to the configured broker (via the
outbox in production).

## Emit a declared event

```js
module.exports = class ReviewsService extends cds.ApplicationService {
  async init() {
    this.after(['CREATE', 'UPDATE'], 'Reviews', async (review) => {
      await this.emit('Reviewed', {
        subject: review.subject,
        rating:  review.rating
      })
    })
    return super.init()
  }
}
```

- `srv.emit('<Event>', payload)` publishes the event; it returns once queued (to the outbox),
  not when subscribers finish — events are fire-and-forget.
- Emit from an `after`/`on` handler so it fires as part of the business operation.

## Emit to another service / low-level

```js
const messaging = await cds.connect.to('messaging')
await messaging.emit('my.custom.topic', { id: 1, rating: 5 })
```

Use the low-level `messaging` service to publish to a specific broker topic without a CDS
declaration (interop with non-CAP consumers).

## Transactions

By default, `srv.emit` uses the **outbox**: the message is stored in the current DB
transaction and delivered only after commit. If the transaction rolls back, the event is never
sent. See [outbox.md](outbox.md). Only bypass the outbox deliberately (immediate/at-most-once
semantics).

## Guidance

Emit through the service (`this.emit`) inside the transaction that makes the change, keep
payloads lean, and let the outbox guarantee the event matches committed data.
