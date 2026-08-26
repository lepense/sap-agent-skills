# extend and annotate

Two CDL directives modify existing definitions without touching their source.

## extend — add elements

```cds
using { Books } from '@capire/bookshop';

extend Books with {
  ISBN      : String;
  supplier  : Association to Suppliers;
  delayedBy : Time;
}
```

Extend nested structures and add element-level annotations too:

```cds
extend Bar with @title: 'Bar' {
  newField : String;
  extend nestedStruct {
    newField : String;
    extend existingField @title: 'Nested Field';
  }
}
```

## annotate — override metadata

`annotate` is the concise form of `extend` when you only add/override annotations:

```cds
annotate Books with @title: 'Publications';       // entity-level
annotate Books with { title @title: 'Name' };     // element-level
annotate Books:author @title: 'Written by';       // path form
```

## Where extensions live

Put extensions in your own `.cds` files that `using` the target. The CDS compiler merges them
into the effective model (CSN `extensions`), leaving upstream sources untouched — so package
updates don't overwrite your changes.

## Guidance

Use `extend` to add fields/associations and `annotate` to adapt labels/UI/metadata. Keep
extensions in dedicated files, and never edit the base or reuse-package sources.
