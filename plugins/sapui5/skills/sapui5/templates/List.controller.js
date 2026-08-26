sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("my.app.controller.List", {

    onSearch: function (oEvent) {
      const sQuery = oEvent.getParameter("query");
      const aFilters = sQuery
        ? [new Filter("title", FilterOperator.Contains, sQuery)]
        : [];
      this.byId("booksList").getBinding("items").filter(aFilters);
    },

    onItemPress: function (oEvent) {
      const oContext = oEvent.getParameter("listItem").getBindingContext();
      const sId = oContext.getProperty("ID");
      this.getOwnerComponent().getRouter().navTo("detail", { id: sId });
    }
  });
});
