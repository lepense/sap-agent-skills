---
description: Add or wire a page in a Fiori elements app using the Page Map, or enhance one via Guided Development.
---

Extend an existing Fiori elements app. Decide which tool fits:

**Adding/whiring a page → Page Map:**
1. Open *Fiori: Show Page Map*.
2. Add an Object Page under the List Report (or a subpage under an Object Page), bound to the
   navigation entity.
3. Let the Page Map update `manifest.json` routing (`routes` + `targets`) — do not hand-edit.
4. Open the page editor to configure its sections/tables.

**Enhancing page behavior → Guided Development:**
1. Open *Fiori: Open Guided Development*.
2. Pick the guide (add custom column, add custom action, enable draft, add value help, ...).
3. Fill parameters, review the diff, and apply — it updates annotations/manifest/extensions.

**Annotations:** if the change is purely presentational (columns, filters, header), edit the
UI annotations (local `annotation.xml` or CAP CDS `@UI.*`) with the annotation language
server, and preview with mock data.

Confirm the result with `npm run start-mock`. Prefer the tools over manual edits so routing
and annotations stay consistent.
