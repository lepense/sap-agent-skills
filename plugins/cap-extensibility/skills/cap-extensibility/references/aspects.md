# Aspects

An **aspect** bundles a set of elements and/or annotations that can be mixed into many
definitions — CAP's composable alternative to deep inheritance.

## Define and apply

```cds
aspect trackable { createdAt : Timestamp; createdBy : String; }

// apply via extend
extend Books with trackable;

// apply via include (':') — sugar for extend, multiple mixins
entity Orders : cuid, managed, trackable { total : Decimal; }
```

## Small, single-concern aspects

Prefer several focused aspects over one monolith — consumers pick what they need:

```cds
aspect cuid       { key ID : UUID; }
aspect managed    { createdAt: DateTime; createdBy: User; modifiedAt: DateTime; modifiedBy: User; }
aspect temporal   { validFrom : Date @cds.valid.from; validTo : Date @cds.valid.to; }

entity Foo : cuid, managed { ... }
entity Bar : cuid, temporal { ... }
```

`@sap/cds/common` ships ready aspects (`cuid`, `managed`, `temporal`) and code lists
(`Currency`, `Country`, `Language`).

## Aspects for cross-cutting concerns

Keep security or UI annotations in aspects/separate files applied via `extend`/`annotate`, so
the core domain stays clean (see separation-of-concerns.md).

## Guidance

Model reusable extension bundles as named aspects; compose them with `:` includes. Small,
well-named aspects give distributed ownership and clean separation of concerns.
