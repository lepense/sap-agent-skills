# manifest.json and routing

The app descriptor `manifest.json` declares configuration in three namespaces.

## sap.app

```json
"sap.app": {
  "id": "my.app",
  "type": "application",
  "i18n": "i18n/i18n.properties",
  "dataSources": {
    "mainService": {
      "uri": "/odata/v4/catalog/",
      "type": "OData",
      "settings": { "odataVersion": "4.0" }
    }
  }
}
```

## sap.ui5

Declares dependencies, models, root view, and routing:

```json
"sap.ui5": {
  "rootView": { "viewName": "my.app.view.App", "type": "XML", "id": "app" },
  "dependencies": { "libs": { "sap.m": {}, "sap.ui.core": {} } },
  "models": {
    "i18n": { "type": "sap.ui.model.resource.ResourceModel", "settings": { "bundleName": "my.app.i18n.i18n" } },
    "": { "dataSource": "mainService", "settings": { "synchronizationMode": "None" } }
  },
  "routing": {
    "config": {
      "routerClass": "sap.m.routing.Router",
      "viewType": "XML",
      "viewPath": "my.app.view",
      "controlId": "app",
      "controlAggregation": "pages"
    },
    "routes": [
      { "name": "list",   "pattern": "",            "target": "list" },
      { "name": "detail", "pattern": "Books/{id}",  "target": "detail" }
    ],
    "targets": {
      "list":   { "viewName": "List",   "viewId": "list" },
      "detail": { "viewName": "Detail", "viewId": "detail" }
    }
  }
}
```

## Using the router

Get it in a controller with `this.getOwnerComponent().getRouter()`; navigate with
`getRouter().navTo("detail", { id })` and react to navigation with
`getRoute("detail").attachPatternMatched(...)`. Configure routing declaratively here rather
than instantiating routers in code.
