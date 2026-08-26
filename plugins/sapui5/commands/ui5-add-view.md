---
description: Add a new XML view, controller, and route to an existing SAPUI5 app.
---

Add a new screen to the user's SAPUI5 app end to end:

1. **View:** create `webapp/view/<Name>.view.xml` — an `mvc:View` with `controllerName`
   pointing at the new controller, built from `sap.m` controls, bound to the model, with
   i18n texts.
2. **Controller:** create `webapp/controller/<Name>.controller.js` extending
   `sap.ui.core.mvc.Controller`. Wire lifecycle hooks (`onInit`) and, if the route carries
   parameters, `attachPatternMatched` to bind an element context.
3. **Route + target:** in `manifest.json` under `sap.ui5.routing`, add a `route` (name +
   pattern) and a matching `target` (viewName + viewId).
4. **Navigation:** from the calling controller, navigate with
   `this.getOwnerComponent().getRouter().navTo("<route>", { <params> })`.
5. **i18n:** add any new text keys to `i18n/i18n.properties`.

Verify by running `ui5 serve` and navigating to the new route. Keep the view declarative and
the controller thin.
