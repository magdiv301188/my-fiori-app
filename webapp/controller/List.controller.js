sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/ActionSheet",
  "sap/m/Button"
], function (
  Controller,
  JSONModel,
  Filter,
  FilterOperator,
  MessageBox,
  ActionSheet,
  Button
) {
  "use strict";

  return Controller.extend("resource.controller.List", {

    /* =========================================================== */
    /* INIT                                                        */
    /* =========================================================== */

    onInit: function () {

      const oComponent = this.getOwnerComponent();

      // attach JSON model safely (works even if manifest fails)
      let oModel = oComponent.getModel("main");

      if (!oModel) {
        oModel = new JSONModel("model/data.json");
        oComponent.setModel(oModel, "main");
        // when data loads, add computed fields (FullName)
        oModel.attachRequestCompleted(function() {
          this._addComputedFields(oModel);
        }.bind(this));
      }

      this.getView().setModel(oModel, "main");

      // If model already has data (synchronous), compute fields immediately
      if (oModel.getProperty && oModel.getProperty('/Resources') && oModel.getProperty('/Resources').length) {
        this._addComputedFields(oModel);
      }

      // update count after rendering
      this.getView().addEventDelegate({
        onAfterRendering: () => this._updateResultCount()
      });

    },


    /* =========================================================== */
    /* SEARCH + FILTER                                             */
    /* =========================================================== */

    onSearch: function (oEvent) {
      const sValue = oEvent.getParameter("newValue") || oEvent.getSource().getValue();
      this._applyFilters(sValue);
    },

    onFilterChange: function () {
      const sValue = this.byId("sfSearch").getValue();
      this._applyFilters(sValue);
    },


    _applyFilters: function (sSearchValue) {

      const aFilters = [];

      /* ---- Search filter ---- */
      if (sSearchValue) {
        aFilters.push(new Filter({
          filters: [
            new Filter("XMUID", FilterOperator.Contains, sSearchValue),
            new Filter("FNAME", FilterOperator.Contains, sSearchValue),
            new Filter("LNAME", FilterOperator.Contains, sSearchValue),
            new Filter("EMAIL", FilterOperator.Contains, sSearchValue)
          ],
          and: false
        }));
      }

      /* ---- Manager filter (from lookup) ---- */
      const sManager = this.byId("selRole").getSelectedKey();
      if (sManager) {
        aFilters.push(new Filter("MMUID", FilterOperator.EQ, sManager));
      }

      const oTable = this.byId("tblResources");
      const oBinding = oTable.getBinding("items");

      if (oBinding) {
        oBinding.filter(aFilters);
      }

      this._updateResultCount();
    },


    /* =========================================================== */
    /* RESULT COUNT                                                */
    /* =========================================================== */

    _updateResultCount: function () {

      const oTable = this.byId("tblResources");
      if (!oTable) return;

      const oBinding = oTable.getBinding("items");

      const iCount = oBinding ? oBinding.getLength() : 0;

      this.byId("ttlResources")
        .setText("Resources (" + iCount + ")");
    },

    /* =========================================================== */
    /* Helpers                                                      */
    /* =========================================================== */

    _addComputedFields: function(oModel) {
      if (!oModel) return;
      var a = oModel.getProperty('/Resources') || [];
      var bChanged = false;
        a.forEach(function (item) {
            var fname = item.FNAME || "";
            var lname = item.LNAME || "";
            item.FULLNAME = (fname + " " + lname).trim();
            item.INITIALS = ((fname.charAt(0) || "") + (lname.charAt(0) || "")).toUpperCase();
            // Compute DISPLAYNAME including XMUID when available
            if (item.XMUID) {
                item.DISPLAYNAME = item.FULLNAME ? item.FULLNAME + " (" + item.XMUID + ")" : item.XMUID;
            } else {
                item.DISPLAYNAME = item.FULLNAME;
            }
            // Compute DISPLAYDATES from BEGDA and ENDDA (fallbacks handled)
            var beg = item.BEGDA || "";
            var end = item.ENDDA || "";
            if (beg && end) {
                item.DISPLAYDATES = beg + " - " + end;
            } else if (beg) {
                item.DISPLAYDATES = beg;
            } else if (end) {
                item.DISPLAYDATES = end;
            } else {
                item.DISPLAYDATES = "";
            }
            bChanged = true; // Mark as changed since we are modifying the item
      });
      if (bChanged) {
        oModel.setProperty('/Resources', a);
      }
    },


    /* =========================================================== */
    /* CLEAR FILTERS                                               */
    /* =========================================================== */

    onClearFilters: function () {

      this.byId("sfSearch").setValue("");
      this.byId("selRole").setSelectedKey("");

      const oBinding = this.byId("tblResources").getBinding("items");
      if (oBinding) {
        oBinding.filter([]);
      }

      this._updateResultCount();
    },


    /* =========================================================== */
    /* ROW CLICK                                                   */
    /* =========================================================== */

    onItemPress: function (oEvent) {

      const oCtx = oEvent.getSource().getBindingContext("main");
      const oData = oCtx.getObject();

      console.log("Selected:", oData);

      // future navigation
      // this.getRouter().navTo("detail", { id: oData.XMUID });
    },


    /* =========================================================== */
    /* ACTION MENU (3 dots)                                        */
    /* =========================================================== */

    onActionMenuPress: function (oEvent) {

      const oButton = oEvent.getSource();
      const oCtx = oButton.getBindingContext("main");
      const oData = oCtx.getObject();

      this._currentResource = oData;

      if (!this._oSheet) {

        this._oSheet = new ActionSheet({
          buttons: [

            new Button({
              text: "Edit",
              icon: "sap-icon://edit",
              press: () => this.onEdit()
            }),

            new Button({
              text: "Delete",
              icon: "sap-icon://delete",
              type: "Reject",
              press: () => this.onDelete()
            })

          ]
        });

        this.getView().addDependent(this._oSheet);
      }

      this._oSheet.openBy(oButton);
    },


    /* =========================================================== */
    /* CREATE                                                      */
    /* =========================================================== */

    onCreate: function () {
    this.getOwnerComponent()
        .getRouter()
        .navTo("create");
},


    /* =========================================================== */
    /* EDIT                                                        */
    /* =========================================================== */

    onEdit: function () {

      if (!this._currentResource) return;

      MessageBox.information(
        "Edit: " +
        this._currentResource.FNAME +
        " " +
        this._currentResource.LNAME
      );
    },


    /* =========================================================== */
    /* DELETE                                                      */
    /* =========================================================== */

    onDelete: function () {

      if (!this._currentResource) return;

      MessageBox.confirm(
        "Delete " + this._currentResource.FNAME + "?",
        {
          onClose: (sAction) => {

            if (sAction === "OK") {

              const oModel = this.getOwnerComponent().getModel("main");
              const aData = oModel.getProperty("/Resources");

              const iIndex = aData.findIndex(r => r.XMUID === this._currentResource.XMUID);

              if (iIndex > -1) {
                aData.splice(iIndex, 1);
                oModel.setProperty("/Resources", aData);
              }

              this._updateResultCount();
            }
          }
        }
      );
    }

  });
});
