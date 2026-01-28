sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("resource.controller.detailsteps.StepAssignment", {

    onSaveAssignment: function () {
      const oModel = this.getView().getModel("create");
      const oData = oModel.getData();

      if (!oData.orgUnit) {
        MessageBox.error("Org Unit is required");
        return;
      }

      console.log("Step 2 data:", oData);

      MessageToast.show("Assignment saved");

      this._goNext();
    },

    _goNext: function () {
      const oWizard = this.getView().getParent().getParent();
      oWizard.nextStep();
    }

  });
});
