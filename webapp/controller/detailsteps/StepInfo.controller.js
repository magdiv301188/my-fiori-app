sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("resource.controller.detailsteps.StepInfo", {

    onSaveInfo: function () {
      const oModel = this.getView().getModel("create");
      const oData = oModel.getData();

      // simple validation
      if (!oData.firstName || !oData.lastName) {
        MessageBox.error("First Name and Last Name are required");
        return;
      }

      console.log("Step 1 data:", oData);

      MessageToast.show("Basic info saved");

      // go to next step
      this._goNext();
    },

    _goNext: function () {
      const oWizard = this.getView().getParent().getParent();
      oWizard.nextStep();
    }

  });
});
