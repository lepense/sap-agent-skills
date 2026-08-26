# The transactional outbox

The outbox makes eventing reliable: an emitted message is stored **in the same database
transaction** as your data changes and delivered to the broker only **after commit**.

## Why

Without an outbox, two failure modes appear:
- Emit succeeds but the transaction rolls back → you published an event for a change that
  never happened.
- The transaction commits but the process crashes before the broker call → the event is lost.

The **persistent outbox** solves both: the message row commits with your data, and a
background delivery loop sends it (retrying) after commit. Delivery survives restarts.

## Enabling

`srv.emit(...)` uses the outbox by default in production. The persistent outbox is configured
under `cds.requires.outbox` (kind `persistent-outbox`), backed by a DB table. Keep it on for
any event that must reflect committed data.

```jsonc
"cds": {
  "requires": {
    "outbox": { "kind": "persistent-outbox" }
  }
}
```

## Semantics

- **At-least-once** delivery: the outbox retries until the broker acknowledges, so a message
  may be delivered more than once → subscribers must be **idempotent**.
- **In-memory outbox** exists for simple cases but does not survive restarts — prefer
  persistent for production.

## Guidance

Emit through the service so the outbox applies; keep the persistent outbox enabled in
production; and pair it with idempotent subscribers to handle the at-least-once guarantee.
