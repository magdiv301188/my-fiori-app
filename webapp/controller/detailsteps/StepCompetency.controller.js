sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("resource.controller.detailsteps.StepCompetency", {

    onSaveCompetency: function () {
      const oModel = this.getView().getModel("create");
      const oData = oModel.getData();

      console.log("Step 3 data:", oData);

      MessageToast.show("Competency saved");

      this._goNext();
    },

    _goNext: function () {
      const oWizard = this.getView().getParent().getParent();
      oWizard.nextStep();
    }

  });
});
