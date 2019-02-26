/**
 * Created by Majdan on 10.02.2019.
 */
({
    cacheAddress: function(component, event){
        let shippingCity = component.get("v.shippingCity");
        let shippingStreet = component.get("v.shippingStreet");
        let shippingCountry = component.get("v.shippingCountry");
        let shippingPostal = component.get("v.shippingPostal");
        let shippingState = component.get("v.shippingState");
        let shippingAddress = {
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
            let navEvt = $A.get('e.force:navigateToURL');
            if(navEvt){
                navEvt.setParams({url: '/summary'});
                navEvt.fire();
            }
        }else{
            this.addErrorClasses(shippingAddress);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Fill_fields'), 'error');
        }
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