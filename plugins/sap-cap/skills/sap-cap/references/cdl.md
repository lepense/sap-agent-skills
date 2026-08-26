# CDL — CDS Definition Language

Model the domain once; services project from it.

## Entities and elements

```cds
namespace my.bookshop;
using { cuid, managed, Currency } from '@sap/cds/common';

entity Books : cuid, managed {
  title    : localized String(111);
  descr    : localized String;
  stock    : Integer;
  price    : Decimal(9,2);
  currency : Currency;
  author   : Association to Authors;
  genre    : Association to Genres;
}

entity Authors : cuid {
  name  : String;
  books : Association to many Books on books.author = $self;
}
```

## Aspects (reuse)

Aspects mix reusable element sets into entities:

```cds
aspect trackable { createdAt : Timestamp; createdBy : String; }
entity Orders : cuid, trackable { total : Decimal; }
```

`@sap/cds/common` provides ready-made aspects: `cuid` (UUID key), `managed`
(created/modified audit fields), plus `Currency`, `Country`, `Language` code lists.

## Associations and compositions

- **Association** — a reference/relationship (`Association to`, `Association to many … on …`).
- **Composition** — a contained child managed by its parent's lifecycle
  (`Composition of many Items on Items.parent = $self`); used for deep insert/update.

## Types and enums

```cds
type Rating : Integer enum { low = 1; medium = 2; high = 3; }
entity Reviews { rating : Rating; }
```

Prefer `localized` for user-facing text; CAP generates the `_texts` entities and handles
language fallbacks automatically.
