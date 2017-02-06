// define a root UI component that exposes the main view
jQuery.sap.declare("BWC_Dashboard.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("BWC_Dashboard.Component", {
    metadata : {
        "name" : "BWC_Mav2",
        "version" : "1.1.0-SNAPSHOT",
        "library" : "BWC_Dashboard",
        "includes" : [ "css/fullScreenStyles.css",
                        "css/icomoon/style.css"],
        "dependencies" : {
            "libs" : [ "sap.m", "sap.ui.layout" ],
            "components" : []
        },
		"config" : {
			resourceBundle : "i18n/messageBundle.properties",
			serviceConfig : {
				name: "BWC-Service-Heroku",
				serviceUrl: "https://cors-anywhere.herokuapp.com/https://bwcmav.herokuapp.com"
			}
		},
        routing : {
            // The default values for routes
            config : {
                "viewType" : "XML",
                "viewPath" : "BWC_Dashboard.view",
                "targetControl" : "fioriContent", // This is the control in which new views are placed
                "targetAggregation" : "pages", // This is the aggregation in which the new views will be placed
                "clearTarget" : false
            },
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master"
				},
				{
					name : "details",
					view : "Details",
					pattern : "{entity}"
				}
			]
        }
    },

    /**
     * Initialize the application
     * 
     * @returns {sap.ui.core.Control} the content
     */
    createContent : function() {
        var oViewData = {
            component : this
        };

        return sap.ui.view({
            viewName : "BWC_Dashboard.view.Main",
            type : sap.ui.core.mvc.ViewType.XML,
            viewData : oViewData
        });
    },

    init : function() {
        // call super init (will call function "create content")
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var sRootPath = jQuery.sap.getModulePath("BWC_Dashboard");

        // The service URL for the oData model 
        var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
        var sServiceUrl = oServiceConfig.serviceUrl;

        // the metadata is read to get the location of the i18n language files later
        var mConfig = this.getMetadata().getConfig();
        this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);

        // create oData model
        this._initODataModel(sServiceUrl);

        // set i18n model
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : [ sRootPath, mConfig.resourceBundle ].join("/")
        });
        this.setModel(i18nModel, "i18n");

        // initialize router and navigate to the first page
        this.getRouter().initialize();

    },

    exit : function() {
        this._routeMatchedHandler.destroy();
    },

    // This method lets the app can decide if a navigation closes all open dialogs
    setRouterSetCloseDialogs : function(bCloseDialogs) {
        this._bRouterCloseDialogs = bCloseDialogs;
        if (this._routeMatchedHandler) {
            this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
        }
    },

    // creation and setup of the oData model
    _initODataModel : function(sServiceUrl) {
        jQuery.sap.require("BWC_Dashboard.util.messages");
        var oConfig = {
            metadataUrlParams : {},
            json : true,
            loadMetadataAsync : true,
            defaultBindingMode :"TwoWay",
            defaultCountMode: "Inline",
            defaultUpdateMethod: "PUT",
            useBatch : false //IANXXX set to false
        };
        var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, oConfig);
        oModel.attachRequestFailed(null, BWC_Dashboard.util.messages.showErrorMessage);
        this.setModel(oModel);
    }
});