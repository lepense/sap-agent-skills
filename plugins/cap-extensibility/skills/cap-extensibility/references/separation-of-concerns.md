# Separation of concerns

Extensibility works best when the base model is clean and cross-cutting concerns live in
separate files applied via `extend`/`annotate`.

## Keep concerns in separate files

```cds
// db/schema.cds — pure domain, no auth/UI noise
entity Books { key ID : UUID; title : String; author : Association to Authors; }

// srv/authorization.cds — security as a separate concern
using { CatalogService } from './cat-service';
annotate CatalogService.Books with @restrict: [{ grant: 'WRITE', to: 'admin' }];

// app/ui-annotations.cds — Fiori UI as a separate concern
annotate CatalogService.Books with @(UI.LineItem: [ { Value: title } ]);
```

## Why it helps extensibility

- The core domain stays readable and stable — the extensible contract.
- Security, UI, and verticalization layers can evolve independently.
- Tenant/feature extensions attach cleanly via `extend`/`annotate` without touching the core.

## Layer order

`base domain` → `service projections` → `authorization` → `UI annotations` →
`verticalization` → `tenant/feature extensions`. Each layer only adds or overrides via
`extend`/`annotate`.

## Guidance

Keep domain, authorization, and UI in separate `.cds` files; apply cross-cutting concerns with
`annotate`/`extend`. A clean, stable core is what makes verticalization, feature toggles, and
tenant extensions maintainable.
