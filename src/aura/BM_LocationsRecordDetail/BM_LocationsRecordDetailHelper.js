/**
 * Created by Majdan on 26.12.2018.
 */
({
    init: function(component, event){
        var action = component.get("c.getUserPermissionSet");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    component.set("v.isButtonVisible", storeResponse);
                } else {
                    this.handleErrors(response);
                }
            });
            $A.enqueueAction(action);
    },
    deleteShop: function(component, event){
        let shop = component.get('v.shop');

        var appEvent = $A.get("e.c:BM_LocationsClearDetailsEvent");
        if(appEvent){
            var action = component.get("c.deleteThisShop");
            action.setParams({acc : shop});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                     appEvent.setParams({"shopToClear" : shop});
                     appEvent.fire();
                     component.set("v.isVisible",false);
                     this.handleToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Toast_success_delete_shop'), "success");
                } else {
                    var errors = response.getError();
                    if (errors) {
                        this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Toast_error_delete_shop'), "error");
                    } else {
                        this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Unknown_error'), "error");
                    }
                }
            });
            $A.enqueueAction(action);
            this.closeModal(component, event);
        } else {
            console.error('Could not find event: BM_LocationsClearDetailsEvent');
        }
    },
    updateShop: function(component, event){
        var shopToEdit = component.get("v.editShop");
        var action = component.get("c.updateThisShop");
        action.setParams({"acc" : shopToEdit});
        action.setCallback(this, function(response) {

            var state = response.getState();
            if (state === "SUCCESS") {
                this.closeModal(component, event);
                var shopUpdated = response.getReturnValue();
                component.set("v.shop", shopUpdated);
                this.sendUpdatedShop(component, event);
                this.handleToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Toast_success_update_shop'), "success");
                //$A.enqueueAction(this.loadingIco(component));
            }
            else{
                var errors = response.getError();
                if (errors) {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Toast_error_update_shop'), "error");
                }else{
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Unknown_error'), "error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    sendUpdatedShop: function(component, event){
        setTimeout($A.getCallback(function(){
            let action = component.get("c.getUpdatedShop");
            action.setParams({"acc" : component.get("v.shop")});
            action.setCallback(this, function(response) {
                component.set("v.shop", response.getReturnValue());

                var appEvent = $A.get("e.c:BM_LocationsRecordSavedEvent");
                appEvent.setParams({"changedShop" : component.get("v.shop")});
                appEvent.fire();
            });
            $A.enqueueAction(action);
        }), 180);
    },
    loadingIco: function(component){
        var loading = component.find("loadingSpinner");

        if(loading){
            loading.waiting();
        } else{
            console.error('Could not find id: loadingSpinner');
        }
    },
    selectModal: function(component, buttonName){
        var modal;
        var modalBackdrop;
        if(buttonName == 'editShopBtn'){
            component.set("v.editShop", component.get("v.shop"));
            modal = 'EditModalBox';
            modalBackdrop = 'EditModalBackdrop';
        }else if(buttonName == 'deleteShopBtn'){
            modal = 'DelModalBox';
            modalBackdrop = 'DelModalBackdrop';
        }
        return [modal, modalBackdrop];
    },
    openModal: function(component, event){
        var buttonName = event.getSource().getLocalId();
        var modalName = this.selectModal(component, buttonName);
        var cmpTarget = component.find(modalName[0]);
        var cmpBack = component.find(modalName[1]);
        component.set("v.buttonName", buttonName);
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open');
    },
    closeModal: function(component, event){
        var buttonName = component.get("v.buttonName");
        var modalName = this.selectModal(component, buttonName);
        var cmpTarget = component.find(modalName[0]);
        var cmpBack = component.find(modalName[1]);
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');

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
    handleErrors: function(response){
        var errors = response.getError();
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.error("Error message: " +
                    errors[0].message);
                }
        } else {
            console.error("Unknown error");
        }
    },
})