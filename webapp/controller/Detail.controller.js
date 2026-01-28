sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], function (Controller, History) {
  "use strict";

  return Controller.extend("resource.controller.detail.Detail", {

    onNavBack: function () {
      const oHistory = History.getInstance();
      const sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getOwnerComponent().getRouter().navTo("list", {}, true);
      }
    },


onNextStep: function () {
    this.byId("wizCreateResource").nextStep();
},


onBackStep: function () {
    this.byId("wizCreateResource").previousStep();
},


_updateFooterButtons: function () {

    const oWizard = this.byId("wizCreateResource");

    const iCurrent = oWizard.getProgress();       // 1-based
    const iTotal   = oWizard.getSteps().length;

    const bFirst = iCurrent === 1;
    const bLast  = iCurrent === iTotal;

    // hide Back on first
    this.byId("btnBack").setVisible(!bFirst);

    // hide Next on last
    this.byId("btnNext").setVisible(!bLast);
}



  });
});
