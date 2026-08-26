# Declaring events

Model events in your service so they are typed, documented, and routed consistently — the
declarative counterpart to ad-hoc messages.

## Declare an event

```cds
service ReviewsService {
  entity Reviews as projection on my.Reviews;

  // fire-and-forget event with a typed payload
  event Reviewed {
    subject : String;
    count   : Integer;
    rating  : Decimal;
  }
}
```

A declared event behaves like an action signature but has no return — emitting it publishes a
message; subscribing handles it.

## Custom topic with @topic

By default the broker topic is the fully-qualified event name
(`ReviewsService.Reviewed`). Override it to match external conventions:

```cds
service OwnService {
  @topic: 'my.custom.topic'
  event OwnEvent { ID: UUID; rating: Decimal; }
}
```

## Payload design

- Keep payloads small — carry keys and essential fields, not whole aggregates.
- Version the event shape deliberately (e.g. include a version in the topic/name) so consumers
  can evolve.
- Prefer identifiers the consumer can use to read back details if it needs more.

## Guidance

Declare events in the service model and use `@topic` for routing/interop. This gives you typed
payloads, generated docs, and a single place to see what your service publishes.
