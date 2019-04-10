/**
 * Created by Dawid Majdański on 21.12.2018.
 */
({
    search: function(component, event) {
        let country = component.get('v.shopCountry');
        let city = component.get('v.shopCity');
        let street = component.get('v.shopStreet');

        var action = component.get("c.getShops");
        action.setParams({shopCountry : country, shopCity : city, shopStreet : street});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.searchEvent(component, response.getReturnValue());
                this.clearEvent(component);
            } else {
                var errors = response.getError();
                if (errors) {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Toast_search_error'), "error");
                } else {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Unknown_error'), "error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    clear: function(component, event){
        component.set("v.shopCountry","");
        component.set("v.shopCity","");
        component.set("v.shopStreet","");

        var emptyArray = [];
        this.searchEvent(component, emptyArray);
        this.clearEvent(component);
    },
    clearEvent: function(component){
        var clearEvt = $A.get("e.c:BM_LocationsClearDetailsEvent");
        if(clearEvt){
            clearEvt.setParams({"shopToClear" : ''});
            clearEvt.fire();
        }else {
            console.error('No such event: BM_LocationsClearDetailsEvent');
        }
    },
    searchEvent: function(component, value){
        var searchEvt = $A.get("e.c:BM_LocationsSearchEvent");
        if(searchEvt){
            searchEvt.setParams({"shopsResultList" : value});
            searchEvt.fire();
        }else {
            console.error('No such event: BM_LocationsSearchEvent');
        }
    },
    handleToast: function(titleMessage, errorName, toastType){
        var toastParams = {
            title: titleMessage,
            message: errorName,
            type: toastType
        };
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
})