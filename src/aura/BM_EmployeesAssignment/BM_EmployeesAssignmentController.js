/**
 * Created by Majdan on 02.01.2019.
 */
({
    onInit: function(component, event, helper){
        helper.getAllEmployees(component, event);
        helper.getAllShops(component, event);
        helper.getAllAssignedEmployees(component, event);
    },
    onAssign: function(component, event, helper){
        helper.assign(component, event);
    },
    handleShopChange: function(component, event, helper){
        var shop = component.find("shopsList").get("v.value");

        if(shop != ''){
            component.set("v.shopSelected", true);
        }else {
            component.set("v.shopSelected", false);
        }

        helper.checkIfEmployeeIsAssigned(component, event);
    },

})