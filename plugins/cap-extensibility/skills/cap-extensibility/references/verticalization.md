# Verticalization

Verticalization = specializing a reusable application or reuse package for an industry or
customer, **without owning or editing** its sources.

## Extend definitions you don't own

```cds
// extend a reuse package's code list
using { sap.common.Countries } from '@sap/cds/common';
extend Countries with { county : String };   // UK counties

// specialize a reused app model
using { Books } from '@capire/bookshop';
extend Books with { ISBN : String };
annotate Books with @title: 'Publications';
```

## Layering

- **Base app / reuse package** — the upstream product (a dependency).
- **Verticalization layer** — your `.cds` files that `using` + `extend`/`annotate` the base.
- **Customer layer** (optional) — further extensions per customer/tenant.

Each layer only adds; the compiler merges them, so upgrading the base package keeps your
verticalization intact as long as the extended definitions remain compatible.

## Reuse packages

Consume shared models as npm packages (`@sap/cds/common`, `@capire/*`, your own
`cds export` packages) and extend them — don't copy their sources into your project.

## Guidance

Build industry/customer specializations as additive extension layers over reuse packages.
Never vendor-in or edit upstream sources; keep each layer additive so upgrades stay clean.
