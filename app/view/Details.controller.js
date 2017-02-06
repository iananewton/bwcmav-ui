jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");

sap.ui.define([
	"BWC_Dashboard/model/formatter",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/Item",
	"sap/ui/core/format/DateFormat"
], function (formatter, MessageToast, Text, NumberFormat, Item, DateFormat) {
	"use strict";

    sap.ui.core.mvc.Controller.extend("BWC_Dashboard.view.Details", {
        _oItemTemplate: null,
        _oNavigationTable: null,
        _sItemPath: "",
        _sNavigationPath: "",

        onInit: function() {
            this._oView = this.getView();
            this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
            this._oRouter = this._oComponent.getRouter();
            //this._oNavigationTable = this.byId("navigationTable");
            //this._oItemTemplate = this.byId("navigationListItem").clone();

            // Define header DOM ids
            this._headerContent = this.byId("headerContent");
            this._headerContainerLayout = this.byId("headerContainerLayout");
            this._headerBlockLayout = this.byId("headerBlockLayout");
            this._headerCell = this.byId("headerCell");
            this._headerToggleChangeButton = this.byId("headerToggleChangeButton");
            this._onToggleChangeHeader = this.byId("onToggleChangeHeader");
            this._headerSaveButton = this.byId("headerSaveButton");
            this._onSubmitChangeHeader = this.byId("onSubmitChangeHeader");
            this._headerDisplayForm = this.byId("headerDisplayForm");
            this._headerChangeForm = this.byId("headerChangeForm");
            this._MasterDataSubtypeSelect = this.byId("MasterDataSubtypeSelect");
            this._MasterDataVesselSelect = this.byId("MasterDataVesselSelect");
            this._relationshipsTable = this.byId("relationshipsTable");
            this._detailsPage = this.byId("DetailsPage");

            // Get Context Path for Page 2 Screen
            this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
        },

        _onRoutePatternMatched: function(oEvent) {
            if (oEvent.getParameter("name") !== "details") {
                return;
            }

            this._MasterDataPath = "/" + oEvent.getParameters().arguments.entity;

            // Bind Object Header and Form using oData
            this._detailsPage.bindElement({
                path: this._MasterDataPath,
                parameters: {
                    expand: "MDSubtype,Transactions,Inputs,MDType,Logs,Vessel"
                },
                events: {
                    dataReceived: function(_oEvent){
                        var oData = _oEvent.getParameters.data;
                        this.getView().byId("MasterDataSubtypeSelect").setSelectedItemId();
                    }
                }
            });
        },

        onNavBack: function() {
            window.history.go(-1);
        },

        //Header Functions

        onToggleChangeHeader : function(evt){
			if (evt.getSource().getPressed()) {
				this._headerDisplayForm.setVisible(false);
				this._headerChangeForm.setVisible(true);
				this._headerToggleChangeButton.setIcon("sap-icon://display");
				this._headerSaveButton.setEnabled(true);
			} else {
				this._headerDisplayForm.setVisible(true);
				this._headerChangeForm.setVisible(false);
				this._headerToggleChangeButton.setIcon("sap-icon://edit");
				this._headerSaveButton.setEnabled(false);
			}
        },

        onHeaderSubmitChange: function(oEvent){
            //Prep model for Update
            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            
            //Establish OData payload for update
            var payload = {};
            var typeSubtypeArray = this._MasterDataSubtypeSelect.getSelectedKey().split(',');
            if(typeSubtypeArray.length === 2){
                payload["MDTypeID"] = typeSubtypeArray[1];
                payload["MDSubTypeId"] = typeSubtypeArray[0];    
            }
            
            var VesselId = this._MasterDataVesselSelect.getSelectedKey();
            if(VesselId !== ""){
                payload["VesselId"] = VesselId;
            }
            
            var ReferenceID = this.getView().byId("ReferenceID").getValue();
            if(ReferenceID !== ""){
                payload["ReferenceID"] = ReferenceID;
            }
            
            //Refresh binding after save
            var updateBindingClosure = function(model){
                return function(a){
                    if(a.hasOwnProperty("statusCode")){
                        if(a.statusCode === 200){
                            MessageToast.show("Changes saved");
                            model.refresh();
                            //_binding.updateBinding();
                        }
                        else{
                            MessageToast.show("Error while saving");
                        }
                    }
                    else{
                        MessageToast.show("Error while saving");    
                    }
                };
            };
            var updateBinding = updateBindingClosure(oModel);

            oModel.update(this._MasterDataPath, payload, {
                success: function(oData, responsePayload){
                    if(responsePayload.statusCode < 300 && responsePayload.statusCode > 199){
                        MessageToast.show("Changes saved");
                    }
                },
                error: updateBinding
            });
        }
    });
});