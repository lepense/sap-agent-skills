# Virtual Data Model (VDM) layers

The VDM organizes CDS views into layers with clear responsibilities. Following it keeps models
reusable and consumers decoupled from tables.

## Layers

- **Basic / Interface views (`ZI_*`)** — the reusable core. Select from tables (or other
  interface views), apply associations and semantics, and expose stable business fields. No
  UI annotations. Marked with `@ObjectModel` classification where relevant.
- **Composite interface views** — interface views that combine other interface views
  (aggregations, unions) for richer reusable models.
- **Consumption views (`ZC_*`)** — the projection layer for one specific consumer (a Fiori
  app, an analytical query, an API). Carry UI/OData/analytics annotations and consumer-
  specific shaping.

## Naming (typical)

- `ZI_*` interface, `ZC_*` consumption, `ZP_*`/`ZR_*` for private/restricted as team
  conventions dictate. Keep names stable — interface views are contracts.

## Why layer

- **Reuse:** many consumption views build on the same interface views.
- **Stability:** consumers depend on consumption views; you can refactor internals without
  breaking them.
- **Separation of concerns:** business semantics in interface views; presentation and
  consumer shaping in consumption views / metadata extensions.

## Guidance

Put logic and associations in interface views; keep consumption views thin projections that
add annotations. Never let a Fiori/analytics consumer bind directly to a raw table or an
interface view laden with UI annotations.
