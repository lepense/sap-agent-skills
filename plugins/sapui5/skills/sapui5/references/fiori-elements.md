# Fiori elements

Fiori elements generates standard SAP Fiori app UIs from an OData service plus **UI
annotations** — no (or minimal) custom view/controller code. Prefer it for standard CRUD.

## Floorplans

- **List Report** — filter bar + table over a collection; drill into an Object Page.
- **Object Page** — header + sections/forms for a single entity and its children.
- **Analytical List Page**, **Overview Page**, **Worklist** — additional templates.

## How it works

1. Expose an OData service (e.g. from CAP or the ABAP RAP model).
2. Annotate the entities with UI annotations (`@UI.LineItem`, `@UI.SelectionFields`,
   `@UI.HeaderInfo`, `@UI.FieldGroup`, `@UI.Facets`).
3. Configure the app in `manifest.json` under `sap.ui5` with the Fiori elements template
   (`sap.fe.templates` component) targeting the annotated entity set.

The annotations drive the rendered columns, filters, sections, and value helps. Change the UI
by changing annotations, not code.

## Extensions

When the standard template needs more, add **flexible programming model** extensions:
controller extensions, custom sections/columns, and custom actions — kept small and local so
the app stays mostly annotation-driven.

## When to go freestyle instead

If the interaction model is non-standard (custom canvas, bespoke visualizations, wizard flows
that annotations cannot express), build a freestyle app with XML views and controllers.
