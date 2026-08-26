# MVC: views and controllers

## XML views

Declarative, async-capable, and tooling-friendly. Reference the controller via
`controllerName` and declare control namespaces as XML namespaces:

```xml
<mvc:View
    controllerName="my.app.controller.Detail"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:f="sap.f">
  <Page title="{i18n>detailTitle}" showNavButton="true" navButtonPress=".onBack">
    <ObjectHeader title="{title}" number="{price}" numberUnit="{currency/code}"/>
  </Page>
</mvc:View>
```

Prefer XML over JS/HTML/JSON views. Event handlers reference controller methods with a
leading dot (`.onBack`).

## Controllers

Extend `sap.ui.core.mvc.Controller`. Use lifecycle hooks and keep controllers thin:

```js
sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";
  return Controller.extend("my.app.controller.Detail", {
    onInit: function () {
      this.getOwnerComponent().getRouter()
        .getRoute("detail").attachPatternMatched(this._onMatched, this);
    },
    _onMatched: function (oEvent) {
      const sId = oEvent.getParameter("arguments").id;
      this.getView().bindElement("/Books(" + sId + ")");
    },
    onBack: function () {
      this.getOwnerComponent().getRouter().navTo("list");
    }
  });
});
```

Common hooks: `onInit`, `onBeforeRendering`, `onAfterRendering`, `onExit`. Access the view
with `this.getView()`, controls with `this.byId("controlId")`, and the component with
`this.getOwnerComponent()`.

## Fragments

Reuse UI snippets (dialogs, table columns) as `sap.ui.core.Fragment` XML files loaded on
demand with `Fragment.load(...)`. Keep dialogs in fragments, not inline in views.
