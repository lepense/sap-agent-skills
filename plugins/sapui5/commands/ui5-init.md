---
description: Scaffold a new SAPUI5 / OpenUI5 application with UI5 Tooling, MVC, and a manifest.
---

Scaffold a new SAPUI5 app for the user. Steps:

1. **Create the project** and `ui5.yaml` with `ui5 init`. Set `type: application` and the
   `framework` (SAPUI5 or OpenUI5) with a pinned version and the libraries you need
   (`sap.m`, `sap.ui.core`, ...). Use `templates/ui5.yaml` as a reference.
2. **webapp structure:** create `webapp/manifest.json`, `webapp/Component.js`,
   `webapp/index.html`, and `view/`, `controller/`, `i18n/` folders — see the templates.
3. **Descriptor:** in `manifest.json`, declare the app id under `sap.app`, the OData
   `dataSource`, and under `sap.ui5` the `rootView`, `dependencies.libs`, `models`
   (default OData model + `i18n` ResourceModel), and `routing`.
4. **First view:** add an XML view + controller (declarative, `sap.m` controls, i18n texts).
5. **Run it:** `ui5 serve --open index.html` and confirm the app loads and binds data.

Stay declarative-first: configure models and routing in the manifest, build UI in XML views,
and keep controllers thin. Prefer Fiori elements when the app is standard CRUD over an
annotated OData service.
