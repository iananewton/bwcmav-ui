sap.ui.define([
	"BWC_Dashboard/model/formatter",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/ObjectStatus",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/Item",
	"sap/ui/core/Icon"
], function (formatter, MessageToast, Text, Dialog, Button, ObjectStatus, NumberFormat, Item, Icon) {
    //Closure Functions
    return {
        masterDataListFactoryClosure : function(that){
            return function(sId, context){
                var item = new sap.m.ObjectListItem({
                    "title" : "{ReferenceID}",
                    "number" : "{ToalPG}",
                    "numberUnit" : "PG",
                    //intro : string
                    //icon : sap.ui.core.URI
                    //activeIcon : sap.ui.core.URI
                    //"markFavorite" : boolean,
                    //markFlagged : boolean,
                    "showMarkers" : true
                    //"numberState" : sap.ui.core.ValueState (default: None)
                    //"markLocked" : boolean (default: false)
                });
                
                //Navigation to Detail Page
                item.attachPress(that.onLineItemPressed);
                
                //Set actual icon
                switch(context.getProperty("MDSubtypeName")){
                    case "Grain": 
                        item.setIcon("sap-icon://nutrition-activity");
                        break;
                    
                    default:
                        item.setIcon("sap-icon://nutrition-activity");
                    break;
                }
                
                
                //Set Status Icon
                if(context.getProperty("ClearingStatus") !== null){
                    item.setActiveIcon(new Icon({
                        "src": "sap-icon://status-in-process"
                        })
                    );
                    item.markLocked(true);
                }
            return item;
            };
        }
    };
});

            /*
            case "Fruit": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing //handle duplicate
                    });
                    break;
                case "Separating Run - Whiskey": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Separating Run - Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case "Spirit Run - Gin": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case "Spirit Run - Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Spirit Run - Flavored Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case "Spirit Run - Whiskey": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Whiskey - Low Wines": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Brandy - Low Wines": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "GNS": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Gin - Spirit": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Whiskey - Spirit": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Brandy - Spirit": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Flavored Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Tails - Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Tails - Whiskey": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "1904 Ginger Apple Liqueur": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Charles Street Apple Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Green Is Gold Apple Brandy": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Shot Tower Gin": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
                case  "Barreled Shot Tower Gin": 
                    item.setIcon({
                        "uri": "sap-icon://nutrition-activity"//cool thing
                    });
                    break;
            */