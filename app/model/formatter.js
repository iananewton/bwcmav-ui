jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.define([
    
    ], function () {
	"use strict";
	
	return {
	    clearingStatusState : function (clearingStatus) {
		    var state;
		    if(clearingStatus === null || clearingStatus === 0 || clearingStatus === false || clearingStatus ===""){
		        state = "Success";
		    }
		    else{
                state = "None";
		    }
		    return state;
		}
	};
});