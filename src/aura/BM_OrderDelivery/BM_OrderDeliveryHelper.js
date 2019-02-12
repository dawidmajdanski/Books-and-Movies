/**
 * Created by Majdan on 10.02.2019.
 */
({
    cacheAddress: function(component, event){
        var shippingCity = component.get("v.shippingCity");
        var shippingStreet = component.get("v.shippingStreet");
        var shippingCountry = component.get("v.shippingCountry");
        var shippingPostal = component.get("v.shippingPostal");
        var shippingState = component.get("v.shippingState");
        var shippingAddress = {
            "shippingCity" : shippingCity,
            "shippingStreet" : shippingStreet,
            "shippingCountry" : shippingCountry,
            "shippingPostal" : shippingPostal,
            "shippingState" : shippingState
        };
        if(shippingCity && shippingStreet && shippingCountry && shippingPostal && shippingState){
            this.removeErrorClasses(shippingAddress);
            sessionStorage.setItem('user--shipping', JSON.stringify(shippingAddress));
            sessionStorage.setItem('deliverySelectionDone', true);
            var navEvt = $A.get('e.force:navigateToURL');
            navEvt.setParams({url: '/summary'});
            navEvt.fire();
        }else{
            this.addErrorClasses(shippingAddress);
            this.handleToast($A.get('$Label.c.Error_toast_title'), "Fill all required fields", "error");
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
    addErrorClasses: function(shippingAddress){
        if(!shippingAddress.shippingCity){
            document.getElementById('shipping-city').classList.add("slds-input-customError");
        }
        if(!shippingAddress.shippingCountry){
            document.getElementById('shipping-country').classList.add("slds-input-customError");
        }
        if(!shippingAddress.shippingPostal){
            document.getElementById('shipping-postal').classList.add("slds-input-customError");
        }
        if(!shippingAddress.shippingState){
            document.getElementById('shipping-state').classList.add("slds-input-customError");
        }
        if(!shippingAddress.shippingStreet){
            document.getElementById('shipping-street').classList.add("slds-input-customError");
        }
    },
    removeErrorClasses: function(shippingAddress){
        if(shippingAddress.shippingCity){
            document.getElementById('shipping-city').classList.remove("slds-input-customError");
        }
        if(shippingAddress.shippingCountry){
            document.getElementById('shipping-country').classList.remove("slds-input-customError");
        }
        if(shippingAddress.shippingPostal){
            document.getElementById('shipping-postal').classList.remove("slds-input-customError");
        }
        if(shippingAddress.shippingState){
            document.getElementById('shipping-state').classList.remove("slds-input-customError");
        }
        this.removeErrorTextAreaClass();
    },
    removeErrorTextAreaClass: function(){
        document.getElementById('shipping-street').classList.remove('slds-input-customError');
    }
})