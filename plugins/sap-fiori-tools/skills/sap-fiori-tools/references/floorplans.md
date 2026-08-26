# Choosing a floorplan

Pick the Fiori elements floorplan that matches the task; each is driven by annotations.

| Floorplan | Use when | Key annotations |
|---|---|---|
| **List Report Object Page** | Browse/filter a collection, drill into a detail page | `@UI.SelectionFields`, `@UI.LineItem`, `@UI.HeaderInfo`, `@UI.Facets` |
| **Worklist** | Act on a focused list of items (no separate filter page) | `@UI.LineItem`, `@UI.HeaderInfo` |
| **Overview Page (OVP)** | Dashboard of cards summarizing many data sets | card annotations (`@UI.Chart`, `@UI.LineItem` per card) |
| **Analytical List Page (ALP)** | Combined analytical (charts) + list exploration | `@UI.Chart`, `@UI.SelectionFields`, `@UI.PresentationVariant` |
| **Form Entry Object Page** | Create/edit a single object via a form | `@UI.FieldGroup`, `@UI.Facets` |
| **Freestyle SAPUI5** | Non-standard UI annotations cannot express | none — custom XML views/controllers |

## Guidance

- Default to **List Report Object Page** for standard master-detail CRUD.
- Use **OVP/ALP** for analytical/summary experiences.
- Only choose **freestyle** when the interaction is genuinely non-standard; you lose the
  annotation-driven, low-code benefits.

Start with the closest floorplan, then refine with Guided Development rather than switching to
freestyle at the first friction.
