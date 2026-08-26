---
description: Add a feature toggle to a CAP app using a feature (fts) folder.
---

Ship an optional feature behind a toggle. Steps:

1. **Create the feature folder:** `fts/<feature>/` containing the feature's additional CDS
   (and any handlers), e.g. `fts/reviews/schema.cds` that `extend`s/`annotate`s the base model
   without changing it.
2. **Author the feature model:** add fields/entities/UI annotations scoped to the feature.
   Keep the base model unchanged so the feature is purely additive.
3. **Register features:** add the feature under `cds.features.fts` (see
   `templates/extensibility-config.json`).
4. **Enable per tenant/user:** toggle via configuration and per-tenant/user assignment (XSUAA
   attributes or MTX feature-toggle config). CAP includes the active feature's model/handlers
   for that request context.
5. **Test both states:** verify the app works with the feature **on** and **off**, and that
   toggling needs no data migration where possible.

Isolate each toggle under `fts/<feature>/`, enable per tenant/user, and design features to be
safe to switch on/off — this replaces per-customer branching.
