# Application Modeler and Page Map

The **Application Modeler** provides a visual model of the app. Its centerpiece is the
**Page Map**.

## Opening

Command palette → *Fiori: Show Page Map* (or open it from the Application Modeler view).

## What it shows

- The app's **pages** (List Report, Object Page, subpages) as connected nodes.
- **Navigation** between pages, derived from entity associations.
- Quick actions on each node: open the **page editor**, the **annotation editor**, or the
  **manifest**.

## Common tasks

- **Add a page:** add an Object Page under a List Report, or a subpage under an Object Page,
  bound to a navigation entity. The Page Map updates `manifest.json` routing (`routes` +
  `targets`) correctly.
- **Delete a page:** removes the route/target and cleans up references.
- **Configure a page:** open the page editor to toggle sections, tables, and settings that
  map to annotations/manifest settings.

## Why use it

Routing and page wiring for Fiori elements is easy to get subtly wrong by hand. The Page Map
keeps `manifest.json` and navigation consistent, so prefer it over manual edits. For behavior
inside a page (columns, actions, drafts), use **Guided Development**.
