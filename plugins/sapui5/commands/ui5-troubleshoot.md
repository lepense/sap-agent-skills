---
description: Diagnose and fix a failing SAPUI5 app (blank page, binding, routing, or build error).
---

Diagnose the SAPUI5 problem methodically:

1. **Capture symptom + console.** Blank page, control not rendering, data not showing, routing
   not working, or `ui5 build` failure? Read the browser console and network tab.
2. **Common causes:**
   - **Blank page / bootstrap:** wrong `data-sap-ui-resourceroots` / component `id`, or
     `manifest.json` `sap.app.id` not matching the folder namespace.
   - **No data:** model not declared in `manifest.json` `sap.ui5.models`, wrong `dataSource`
     URI, or binding path mismatch (`/Books` vs `Books`). Check the OData `$metadata` loads.
   - **Routing:** route `pattern`/`target` mismatch, missing `controlId`/`controlAggregation`,
     or router not initialized in `Component.js`.
   - **Binding:** relative binding without a binding context; missing formatter reference
     (leading dot); wrong model name prefix (`i18n>`).
   - **Build:** missing library in `ui5.yaml` `framework.libraries`.
3. **Isolate:** reproduce with `ui5 serve`; add a `JSONModel` with static data to confirm the
   view binds, then swap back to OData.
4. **Fix minimally** and re-run `ui5 serve` (and `ui5 build` if it was a build error) to
   confirm resolution.
