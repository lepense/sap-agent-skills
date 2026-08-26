---
name: cap-extensibility
description: Extend SAP CAP models — extend/annotate, aspects, verticalization, exposing extension entities, SaaS tenant extensions via MTX, and feature toggles.
license: MIT
---

# CAP extensibility

## What this covers

Extending CAP models without modifying the originals: the **`extend`** and **`annotate`**
directives, reusable **aspects**, **verticalization** (extending reuse packages you don't
own), **exposing** extension entities through services, **SaaS tenant extensions** (subscribers
extend the app at runtime via **MTX**), and **feature toggles**. Prefer additive, aspect-based
extension over forking base models. Detail lives in [references/](references).

## extend and annotate

Add fields/associations to an existing entity, or override its metadata, from your own files:

```cds
using { Books } from '@capire/bookshop';

extend Books with {
  ISBN     : String;
  supplier : Association to Suppliers;   // new association
}

annotate Books with @title: 'Publications';   // override a label
annotate Books with { title @title: 'Name' }; // override an element annotation
```

`extend` adds; `annotate` (a concise `extend` for annotations only) overrides metadata. Neither
touches the upstream source. See [references/extend-annotate.md](references/extend-annotate.md).

## Aspects

Bundle cross-cutting elements/annotations into a named **aspect** and apply it to many
entities — the composable, multiple-mixin alternative to monolithic base entities:

```cds
aspect trackable { createdAt : Timestamp; createdBy : String; }
extend Books with trackable;
entity Orders : cuid, managed, trackable { ... }   // ':' include = apply aspects
```

See [references/aspects.md](references/aspects.md).

## Verticalization

Extend reuse definitions you don't own — industry/customer specialization — without editing
the package:

```cds
using { sap.common.Countries } from '@sap/cds/common';
extend Countries with { county : String };   // e.g. UK counties
```

See [references/verticalization.md](references/verticalization.md).

## Exposing extension entities

If new extension entities aren't auto-exposed, project them into an existing service:

```cds
using { OrdersService } from '@capire/fiori';
extend service OrdersService with {
  entity x_Regions as projection on extension.x_Regions;
}
```

See [references/expose-extensions.md](references/expose-extensions.md).

## SaaS tenant extensions (MTX)

In a multitenant SaaS app, **subscribers** extend the base model for their own tenant at
runtime — adding fields, entities, and annotations — through the **MTX** extensibility
services, without redeploying the base app. The provider governs what may be extended. See
[references/saas-tenant-extensions.md](references/saas-tenant-extensions.md).

## Feature toggles

Ship optional model/behavior behind **feature toggles** (`fts/` feature folders), enabled per
tenant/user, so features roll out without branching. See
[references/feature-toggles.md](references/feature-toggles.md).

## Governance

Extensibility needs guardrails: reserve extension fields, restrict which entities/services can
be extended, and validate tenant extensions. See [references/governance.md](references/governance.md)
and [references/separation-of-concerns.md](references/separation-of-concerns.md).

## Anti-patterns (Don't)

- **Don't** fork or edit upstream/reuse package sources — `extend`/`annotate` from your files.
- **Don't** pile everything into one base entity — compose small aspects.
- **Don't** let SaaS tenants extend arbitrarily — govern with reserved fields / whitelists.
- **Don't** branch the codebase per customer — use tenant extensions and feature toggles.
- **Don't** mix authorization/UI annotations into the core domain file — separate concerns.
- **Don't** break extension compatibility on upgrades — keep base entities extension-stable.

## References

- [references/extend-annotate.md](references/extend-annotate.md) — `extend` / `annotate`.
- [references/aspects.md](references/aspects.md) — reusable aspects.
- [references/verticalization.md](references/verticalization.md) — extending reuse packages.
- [references/expose-extensions.md](references/expose-extensions.md) — exposing extensions.
- [references/saas-tenant-extensions.md](references/saas-tenant-extensions.md) — MTX tenant extensions.
- [references/feature-toggles.md](references/feature-toggles.md) — feature toggles.
- [references/governance.md](references/governance.md) — guardrails.
- [references/separation-of-concerns.md](references/separation-of-concerns.md) — modular files.
