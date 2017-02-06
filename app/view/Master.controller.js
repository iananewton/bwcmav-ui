jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.m.TablePersoController");

sap.ui.core.IconPool.addIcon('Mashing', 'customfont', 'icomoon', 'e900');
sap.ui.core.IconPool.addIcon('Processing', 'customfont', 'icomoon', 'e901');
sap.ui.core.IconPool.addIcon('Production', 'customfont', 'icomoon', 'e902');
sap.ui.core.IconPool.addIcon('Storage', 'customfont', 'icomoon', 'e903');
sap.ui.core.IconPool.addIcon('Ferm', 'customfont', 'icomoon', 'e904');

sap.ui.define([
	"BWC_Dashboard/model/formatter",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/Item",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/ObjectStatus",
	"sap/ui/core/Icon",
	"sap/ui/model/json/JSONModel"
], function (formatter, MessageToast, Text, NumberFormat, Item, Dialog, Button, ObjectStatus, Icon, JSONModel) {
	"use strict";
	
    sap.ui.core.mvc.Controller.extend("BWC_Dashboard.view.Master", {
    	_oCatalog: null,
    	_oResourceBundle: null,
    
    	onInit: function() {
    		//Define a few global parameters
    		this._oView = this.getView();
    		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
    		this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();
    		this._oRouter = this._oComponent.getRouter();
    		this._oCatalog = this.byId("catalogTable");
    		this._oOnlyOpenSwitch = this.byId("onlyOpenSwitch");
            
            //Instantiate the view properties model
    		this._initViewPropertiesModel();
    		
    		//Create the filter model
            function newFilter(field, isactive, filter, values) {
                this.field = field;
                this.isactive = isactive;
                this.filter = filter;
                if(values){
                    this.values = [];
                }
                else{
                    this.values = values;
                }
            }
            var ReferenceIDFilter = new newFilter("ReferenceID", false, null);
            var TypeFilter = new newFilter("MDSubtypeId", false, null);
            //var TypeFilter = new newFilter("MDTypeId", false, null); Commented until filtering on expanded entities possible
            TypeFilter.types = {"Mash":false, "Ferm":false, "Prod":false,"Stor":false,"Proc":false};
            TypeFilter.constants = {"Mash":[1,2], "Ferm":[3,4], "Prod":[5,6,7,8,9,10],"Stor":[11,12,13,14,15,16,17,18,19],"Proc":[20,21,22,23,24]};
            var OpenFilter = new newFilter("ClearingStatus", false, null, [0]);
            var filterModel = new JSONModel({
				ReferenceIDFilter: ReferenceIDFilter,
				TypeFilter: TypeFilter,
				OpenFilter: OpenFilter
			});
    		this._oView.setModel(filterModel, "ui");
    	},
    	
    	_filter : function () {
			var oBinding = this.byId("catalogTable").getBinding("items");
			var newFilter = null;
			var fs = this._oView.getModel("ui").getData();
			var i = 0;
			var filters = [];
            
            for(var key in fs){
                if(!fs[key].isactive){
                    //First check that the filter object's values are initialized
                    fs[key].filter = null;
                    fs[key].values = [];
                    newFilter = null;
                }
                else{
                    newFilter = new sap.ui.model.Filter(fs[key].field, sap.ui.model.FilterOperator.EQ, fs[key].values);
                    filters.push(newFilter);
                    fs[key].filter = newFilter;
                }
            }
            
            if(filters.length > 0){
                oBinding.filter(filters);
            }
            else{
                oBinding.filter([]);
            }
		},
    	
    	openToggle : function(oEvent) {
    	    //Set open filter value = 0 if active
    	    if(oEvent.getSource().getState()){
    	        var Json = this._oView.getModel("ui").getData();
    		    Json.OpenFilter.values = [0];
    		    this._oView.getModel("ui").setData(Json);
    	    }
		    this._filter();
		},
		
		onFilterByType : function(oEvent){
		    var fs = this.oView.getModel("ui").getData();
		    fs.TypeFilter.values = [];
		    for(var key in fs.TypeFilter.types){
		        if(fs.TypeFilter.types[key]){
		            for(var i = 0; i < fs.TypeFilter.constants[key].length; i++){
		                fs.TypeFilter.values.push(fs.TypeFilter.constants[key][i]);
		            }
		            if(!fs.TypeFilter.isactive){
		                fs.TypeFilter.isactive = true;
		            }
		        }
		    }
		    this.oView.getModel("ui").setData(fs);
            this._filter();
		},
    
    	// The model created here is used to set values or view element properties that cannot be bound
    	// directly to the OData service. Setting view element attributes by binding them to a model is preferable to the
    	// alternative of getting each view element by its ID and setting the values directly because a JSon model is more
    	// robust if the customer removes view elements (see extensibility).
    	_initViewPropertiesModel: function() {
    		var oViewElemProperties = {};
    		oViewElemProperties.catalogTitleText = "MasterData";
    		if (sap.ui.Device.system.phone) {
    			oViewElemProperties.availabilityColumnWidth = "80%";
    			oViewElemProperties.pictureColumnWidth = "5rem";
    			oViewElemProperties.btnColHeaderVisible = true;
    			oViewElemProperties.searchFieldWidth = "100%";
    			oViewElemProperties.catalogTitleVisible = false;
    			// in phone mode the spacer is removed in order to increase the size of the search field
    			this.byId("tableToolbar").removeContent(this.byId("toolbarSpacer"));
    		} else {
    			oViewElemProperties.availabilityColumnWidth = "18%";
    			oViewElemProperties.pictureColumnWidth = "9%";
    			oViewElemProperties.btnColHeaderVisible = false;
    			oViewElemProperties.searchFieldWidth = "30%";
    			oViewElemProperties.catalogTitleVisible = true;
    		}
    		this._oViewProperties = new sap.ui.model.json.JSONModel(oViewElemProperties);
    		this._oView.setModel(this._oViewProperties, "viewProperties");
    	},
    	
    	onNavBack: function() {
    		window.history.go(-1);
    	},
    
    	// --- List Handling
    
    	// Handler method for the table search.
    	onSearchReferenceID: function() {
        	var sValue = this.byId("searchField").getValue();
            var oFilter = new sap.ui.model.Filter("ReferenceID", 
    												sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = this.byId("catalogTable").getBinding("items");
            oBinding.filter([oFilter]);	
    	},
    
    	// --- Navigation
        onLineItemPressed: function(oEvent) {
    		this._oRouter.navTo("details", {
    			from: "main",
    			entity: oEvent.getSource().getBindingContext().getPath().substr(1),
    			tab: null
    		});
        },
        
        onCreateNewMasterData: function(evt){
            //Define function to create master data as confirm event of dialog
            var createMasterData = function(createEvent){
                //Get the selected master data subtype and build the oData payload for Create
                var item = createEvent.getParameters().selectedItem;
	            var subtypeString = item.getBindingContextPath().split("(")[1];
	            var subtype = subtypeString.split(")")[0];
                var dateTime = new Date();
    			var payload = {
    			    "MDSubtypeId" : subtype,
    			    "MDDateTime" : dateTime
    			};
    			
                this.getModel().create("/MasterData", payload, {
                    success:    function(oData, response) {
                        this._oRouter.navTo("details", {
                			from: "main",
                			entity: oData.stuff,
                			tab: null
                		});
                    }, 
                    error: function(oError){
                        MessageToast.show(oError);
                    }
                });
            };

            //Define factory function to build the subtypeItem dialog of Master Data type/subtypes
	        var selectDialogFactory = function(sId, oContextSelectDialog){
	            var subtypeItem = new sap.m.StandardListItem({
                    title: "{MDSubtypeName}",
                    description:"{MDType/MDTypeName}"
                });
                
                var mdType = oContextSelectDialog.getProperty("MDType");
                switch(mdType.id){
                    case 1:
                        subtypeItem.setIcon("sap-icon://customfont/Mashing");
                        break;
                    
                    case 2:
                        subtypeItem.setIcon("sap-icon://customfont/Ferm");
                        break;
                        
                    case 3:
                        subtypeItem.setIcon("sap-icon://customfont/Production");
                        break;
                    
                    case 4:
                        subtypeItem.setIcon("sap-icon://customfont/Storage");
                        break;
                    
                    case 5:
                        subtypeItem.setIcon("sap-icon://customfont/Processing");
                        break;
    
                    default:
                        subtypeItem.setIcon("sap-icon://nutrition-activity");
                    break;
                }

                return subtypeItem;
            };

            //Third, define funciton to create the Select Dialog, including the confirm function
	        var createDialog = new sap.m.SelectDialog({
	            "title": "Choose Dispatch Type",
	            "confirm": createMasterData
	        });

	        createDialog.setModel(this.getView().getModel());

	        var subtypesReceived = function(dialog){
	            dialog.open();
	        };
	        createDialog.bindAggregation("items", {
	            "path": "/MasterDataSubtype", 
	            "factory": selectDialogFactory,
	            "events":{
	                dataReceived: subtypesReceived(createDialog)//After binding items have to open the dialog
	            },
	            parameters : {expand:'MDType'}
            });
        },
        
        onMasterDataReceived : function(oEvent){
            var abc = oEvent;
        },
        
        phoneFactory : function(sId, context){
            //Instantiate Object List Item
            var item = new sap.m.ObjectListItem({
                "title" : "{ReferenceID}",
                "activeIcon" : "sap-icon://status-in-process",
                "showMarkers" : true,
                "intro" : "{MDSubtype/MDSubtypeName}"
            });
            
            //Set the 'id' as a status
            var _id = context.getProperty("id");
            item.setSecondStatus(new sap.m.ObjectStatus({title:"ID",text : _id}));
            
            //Set date as an attribute
            var jsDate = new Date(context.getProperty("MDDateTime"));
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({style : "short" }); 
		    var dateString = dateFormat.format(jsDate);
            item.addAttribute(new sap.m.ObjectAttribute({title:"On",text : dateString}));

            //Prep the transactions aggregation
            var transactionsObj = {
                "totalPG" : 0,
                "totalGallons" : 0,
                "totalBottles" : 0,
                "transactions" : []
            };
            var i = 0;
            transactionsObj.transactions = context.getProperty("Transactions");
            if(transactionsObj.transactions.length > 0){
                var transaction = {};
                for(i = 0; i < transactionsObj.transactions.length; i++){
                    transaction = context.getModel().oData[transactionsObj.transactions[i]];
                    transactionsObj.totalPG += Number(transaction.PG);
                    transactionsObj.totalGallons += Number(transaction.Gallons);
                    transactionsObj.totalBottles += Number(transaction.Bottles);
                }
            }

            //Vessel
            item.addAttribute(new sap.m.ObjectAttribute({title:"In", text : context.getProperty("Vessel").VesselName}));

            //Navigation to Detail Page
            item.setType(sap.m.ListType.Active);
            item.attachPress(this.onLineItemPressed, this);

            //Set case-specific properties
            switch(context.getProperty("MDSubtype/MDTypeId")){
                case 1:
                    //Set Icon, Number
                    item.setIcon("sap-icon://customfont/Mashing");
                    item.setNumber(transactionsObj.totalGallons);
                    item.setNumberUnit("gal.");
                    break;
                
                case 2:
                    item.setIcon("sap-icon://customfont/Ferm");
                    item.setNumber(transactionsObj.totalGallons);
                    item.setNumberUnit("gal.");
                    break;
                    
                case 3:
                    item.setIcon("sap-icon://customfont/Production");
                    item.setNumber(transactionsObj.totalPG);
                    item.setNumberUnit("proof-gal.");
                    break;
                
                case 4:
                    item.setIcon("sap-icon://customfont/Storage");
                    item.setNumber(transactionsObj.totalPG);
                    item.setNumberUnit("proof-gal.");
                    break;
                
                case 5:
                    item.setIcon("sap-icon://customfont/Processing");
                    item.setNumber(transactionsObj.totalBottles);
                    item.setNumberUnit("btls.");
                    break;

                default:
                    item.setIcon("sap-icon://nutrition-activity");
                break;
            }

            //Set Status Icon
            if(context.getProperty("ClearingStatus") === null || context.getProperty("ClearingStatus") === ""){
                item.setFirstStatus(new sap.m.ObjectStatus({"state":"Success"}));
            }
            else{
                item.setActiveIcon("sap-icon://status-completed");
                item.setMarkLocked(true);
            }
        return item;
        },

        masterDataListFactory: function(sId, context){
            if(sap.ui.Device.system.phone){
                return this.phoneFactory(sId, context);
            }
            //Might make a device-responsive version
            else{
                return this.phoneFactory(sId, context);
            }
        }
    });
});