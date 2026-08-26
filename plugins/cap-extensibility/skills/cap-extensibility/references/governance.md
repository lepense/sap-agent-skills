# Extensibility governance

Uncontrolled extensibility becomes unmaintainable. As a provider, define what subscribers may
extend and guard the base model's stability.

## Whitelisting

Configure which entities, services, and namespaces are extensible, and constrain the allowed
field types/counts. In MTX this is expressed in the extensibility configuration
(`cds.requires.cds.xt.ExtensibilityService` / `model-provider` settings), e.g. allowed
extension targets and limits.

## Reserved extension fields

Some scenarios pre-reserve capacity for extension fields via an aspect so the physical schema
can absorb tenant fields predictably:

```cds
aspect extensible { s1:String; s2:String; s3:String; i1:Integer; i2:Integer; dt1:DateTime; }
extend Books with extensible;
```

## Naming and isolation

- Prefix extension artifacts (`x_...`) so they're distinguishable and can be whitelisted.
- Keep tenant extensions isolated (MTX enforces per-tenant scope).

## Stability across upgrades

- Treat extended entities/fields as a **contract**: don't rename/remove elements that tenant
  extensions depend on.
- Version the base model and communicate breaking changes.
- Validate tenant extensions on activation (MTX rejects invalid ones).

## Guidance

Decide up front what is extensible, restrict it, reserve capacity where the platform needs it,
name extensions clearly, and keep the extensible surface stable so subscriber extensions
survive your releases.
