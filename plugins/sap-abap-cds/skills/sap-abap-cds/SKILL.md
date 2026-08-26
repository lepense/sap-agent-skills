---
name: sap-abap-cds
description: Model ABAP Core Data Services (CDS) — view entities, associations, annotations, the Virtual Data Model layers, access control (DCL), and analytical queries.
license: MIT
---

# ABAP CDS developer

> This is **ABAP CDS** (data modeling on the ABAP stack, `DEFINE VIEW ENTITY`), distinct from
> CAP's CDS/CDL. For CAP, use the `sap-cap` skill.

## What this covers

Modeling data with **ABAP Core Data Services**: view entities, associations, expressions,
annotations, the **Virtual Data Model (VDM)** layering, access control with **DCL**, and
analytical/transactional consumption. ABAP CDS is the foundation for RAP data models, Fiori
elements services, and analytics. Detail lives in [references/](references).

## View entities

Prefer the modern **`DEFINE VIEW ENTITY`** syntax (not the legacy `DEFINE VIEW ... WITH`):

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Book (interface view)'
define view entity ZI_Book
  as select from zbook
  association [0..1] to ZI_Author as _Author on $projection.AuthorId = _Author.Id
{
  key id            as Id,
      title         as Title,
      author_id     as AuthorId,
      @Semantics.amount.currencyCode: 'CurrencyCode'
      price         as Price,
      currency_code as CurrencyCode,
      _Author
}
```

View entities have built-in association handling and stricter, cleaner semantics than classic
CDS views. See [references/view-entities.md](references/view-entities.md).

## Associations

Model relationships with `association [card] to Target as _Alias on ...`. Expose the alias in
the field list to make it usable by consumers (path expressions, `$expand`). Prefer
associations over joins for reuse and for RAP/Fiori navigation. See
[references/associations.md](references/associations.md).

## The Virtual Data Model (VDM)

Layer your views:

- **Interface views** (`ZI_*`) — reusable, stable, private-to-app building blocks over tables
  or other interface views.
- **Consumption views** (`ZC_*`) — projection layer exposed to a specific consumer (a Fiori
  app, an analytical query), carrying UI/OData/analytics annotations.

Keep business semantics in interface views; keep consumer-specific shaping and UI annotations
in consumption views. See [references/vdm-layers.md](references/vdm-layers.md).

## Annotations

Annotations add semantics and drive downstream frameworks:

- **`@Semantics.*`** — amounts/currencies, quantities/units, dates, user fields.
- **`@UI.*`** — Fiori elements rendering (usually in consumption views or metadata
  extensions).
- **`@Analytics.*` / `@ObjectModel.*`** — analytics and VDM classification.
- **`@Consumption.*`** — value help, filtering, default values.

Prefer **metadata extensions** (`.ddlx`) for UI annotations to keep the view definition clean.
See [references/annotations.md](references/annotations.md).

## Access control (DCL)

Row-level authorization is declared separately in a **DCL** access control (`.dcls`), not in
the view:

```abap
@EndUserText.label: 'Access control for ZI_Book'
define role ZI_Book_Access {
  grant select on ZI_Book
    where ( AuthorId ) = aspect pfcg_auth( ZAUTH_BOOK, AUTHORID, ACTVT = '03' );
}
```

The view declares `@AccessControl.authorizationCheck: #CHECK`; the DCL supplies the rule. See
[references/access-control-dcl.md](references/access-control-dcl.md).

## Analytics

Classify cubes/dimensions with `@Analytics.dataCategory` and `@ObjectModel` to expose CDS as
analytical queries (consumed by Fiori analytical apps / Analytics). See
[references/analytics.md](references/analytics.md).

## Anti-patterns (Don't)

- **Don't** use the legacy `DEFINE VIEW` for new models — use `DEFINE VIEW ENTITY`.
- **Don't** put UI annotations in interface views — use consumption views / metadata
  extensions.
- **Don't** join where an association models the relationship better (reuse, navigation).
- **Don't** `SELECT *` semantics — expose only the fields consumers need.
- **Don't** embed authorization logic in the view — declare it in DCL.
- **Don't** skip `@Semantics` for amounts/quantities — downstream formatting depends on it.

## References

- [references/view-entities.md](references/view-entities.md) — view entity syntax.
- [references/associations.md](references/associations.md) — associations and path expressions.
- [references/vdm-layers.md](references/vdm-layers.md) — interface vs consumption views.
- [references/annotations.md](references/annotations.md) — annotation catalog.
- [references/access-control-dcl.md](references/access-control-dcl.md) — DCL row authorization.
- [references/analytics.md](references/analytics.md) — analytical CDS.
- [references/service-exposure.md](references/service-exposure.md) — exposing CDS as OData.
- [references/cds-testing.md](references/cds-testing.md) — testing CDS with mock data.
