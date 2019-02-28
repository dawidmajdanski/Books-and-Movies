/**
 * Created by Majdan on 09.02.2019.
 */
({
    init: function(component, event, helper){
        helper.initPageVisibility(component);
    },
    handleSetShippingAddress: function(component, event, helper){
        component.set("v.isBillingSameAsShipping", !component.get("v.isBillingSameAsShipping"));
        if(component.get("v.isBillingSameAsShipping")){
            component.set("v.shippingCity", component.get("v.user").City);
            component.set("v.shippingPostal", component.get("v.user").PostalCode);
            component.set("v.shippingCountry", component.get("v.user").Country);
            component.set("v.shippingState", component.get("v.user").State);
            component.set("v.shippingStreet", component.get("v.user").Street);
            document.getElementById("shipping-street").value = component.get("v.user").Street;
            helper.removeErrorTextAreaClass();
        }else{
            component.set("v.shippingCity", "");
            component.set("v.shippingPostal", "");
            component.set("v.shippingCountry", "");
            component.set("v.shippingState", "");
            component.set("v.shippingStreet", "");
            document.getElementById("shipping-street").value = "";
        }
    },
    handleGoToOrderSummary: function(component, event, helper){
       helper.cacheAddress(component);
    },
    setShippingState: function(component, event, helper){
        component.set("v.shippingState", document.getElementById("shipping-state").value);
    },
    setShippingPostal: function(component, event, helper){
        component.set("v.shippingPostal", document.getElementById("shipping-postal").value);
    },
    setShippingCity: function(component, event, helper){
        component.set("v.shippingCity", document.getElementById("shipping-city").value);
    },
    setShippingCountry: function(component, event, helper){
        component.set("v.shippingCountry", document.getElementById("shipping-country").value);
    },
    setShippingStreet: function(component, event, helper){
        component.set("v.shippingStreet", document.getElementById("shipping-street").value);
        helper.removeErrorTextAreaClass();
    },
})