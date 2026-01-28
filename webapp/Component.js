sap.ui.define([
    "sap/ui/core/UIComponent",
    "resource/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("resource.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

       init() {
    UIComponent.prototype.init.apply(this, arguments);

    const JSONModel = sap.ui.require("sap/ui/model/json/JSONModel");

    this.setModel(new JSONModel("model/data.json"), "main");
    this.setModel(new JSONModel("model/lookups.json"), "lookup");

    // device model
    this.setModel(models.createDeviceModel(), "device");


    this.getRouter().initialize();
}


    });
});