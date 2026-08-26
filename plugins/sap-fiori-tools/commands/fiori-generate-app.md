---
description: Generate a SAP Fiori elements app with SAP Fiori tools (Application Generator).
---

Generate a Fiori elements app for the user. Steps:

1. **Choose a floorplan** that fits the task — default to **List Report Object Page** for
   standard master-detail CRUD; use OVP/ALP for analytical UIs; freestyle only when
   annotations cannot express the UI. See the skill's `floorplans.md`.
2. **Pick the data source:** a running system, a local `metadata.xml`, or a **CAP project**
   (point at the CAP folder and service, e.g. `CatalogService`).
3. **Select entities:** the main entity (and a navigation entity for the Object Page).
4. **Generate:** in VS Code/BAS run *Fiori: Open Application Generator*, or on the CLI use
   `npx @sap/generator-fiori` (headless with a config file like `templates/generator-config.json`
   for repeatable scaffolding).
5. **Run it:** `npm run start-mock` to preview against mock data, then `npm start` for the
   real backend.

After generating, refine with the **Page Map** and **Guided Development** — do not hand-edit
the generated floorplan boilerplate. Keep the app annotation-driven.
