sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("resource.controller.detailsteps.StepService", {

    onSaveService: function () {
      const oModel = this.getView().getModel("create");
      const oData = oModel.getData();

      console.log("FINAL RESOURCE OBJECT:", oData);

      MessageToast.show("Resource created successfully!");

      // later replace with OData POST

      this._goBackToList();
    },

    _goBackToList: function () {
      this.getOwnerComponent().getRouter().navTo("list");
    }

  });
});
