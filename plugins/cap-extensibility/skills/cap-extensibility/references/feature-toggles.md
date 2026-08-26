# Feature toggles

Feature toggles ship optional model and behavior that is enabled per tenant/user — rolling
features out without branching the codebase.

## Feature folders (fts)

Place a feature's additional CDS (and code) under `fts/<feature>/`:

```
fts/
  reviews/
    schema.cds     # extends the base model with review UI/fields
```

```cds
// fts/reviews/schema.cds
using { CatalogService } from '../../srv/cat-service';
annotate CatalogService.Books with @(UI.LineItem: [ ..., { Value: rating } ]);
```

The base model stays unchanged; the feature layer is merged only when the feature is active.

## Enabling features

Features are toggled via `cds.features` configuration and per-tenant/user assignment (e.g.
through XSUAA attributes or MTX feature-toggle configuration). At runtime CAP includes the
active features' models/handlers for that request context.

## Use cases

- Beta features for selected tenants.
- Tenant/plan-specific capabilities.
- Gradual rollout and quick disable if something misbehaves.

## Guidance

Keep each toggle's model/behavior isolated under `fts/<feature>/`; enable per tenant/user via
configuration; and design features to be safe to turn on/off without data migration where
possible.
