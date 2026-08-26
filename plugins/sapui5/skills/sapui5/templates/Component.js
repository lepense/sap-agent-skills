sap.ui.define([
  "sap/ui/core/UIComponent"
], function (UIComponent) {
  "use strict";

  return UIComponent.extend("my.app.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      // call the base component's init (processes the manifest: models, etc.)
      UIComponent.prototype.init.apply(this, arguments);

      // initialize the router declared in manifest.json > sap.ui5.routing
      this.getRouter().initialize();
    }
  });
});
