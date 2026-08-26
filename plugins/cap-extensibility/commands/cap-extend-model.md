---
description: Extend a CAP model (entity/service/annotations) without editing base sources.
---

Extend the user's CAP model additively. Steps:

1. **Locate the target** — the base entity/service (in this app or a reuse package). `using` it
   from your own `.cds` file; never edit the base source.
2. **Add fields/associations:** `extend <Entity> with { newField : Type; assoc : Association to
   X; }`. Prefix extension fields (`x_`) where governance applies. See `templates/extend-model.cds`.
3. **Override metadata:** `annotate <Entity> with @title:'...'` (entity) or
   `annotate <Entity> with { field @title:'...' }` (element). See `templates/annotate-override.cds`.
4. **New extension entities:** define them (e.g. `db/extension.cds`), then expose via
   `extend service <Service> with { entity x_Foo as projection on extension.x_Foo; }`. See
   `templates/extend-service.cds`.
5. **Surface in UI:** add `@UI.LineItem`/field annotations for new fields that should appear in
   Fiori.
6. **Verify:** `cds compile` / `cds watch` — the effective model includes the extensions and the
   base sources are untouched.

Keep extensions in dedicated files, separate cross-cutting concerns (auth/UI), and prefer small
aspects for reusable bundles.
