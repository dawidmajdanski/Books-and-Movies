/**
 * Created by Majdan on 26.12.2018.
 */
({
    handleRecordClicked: function(component, event, helper){
        var shopElement = event.getParam("shopElement");

        component.set("v.shop", shopElement);

        if(component.get("v.shop")){
                component.set("v.isVisible", true);
        }else{
                component.set("v.isVisible", false);
        }

       var employeesList = component.find("employeesList");
       employeesList.getRelatedEmployees();
    },
    handleRecordClear: function(component, event, helper){
        let itemToClear = event.getParam("shopToClear");
        component.set("v.shop", itemToClear);
        if(itemToClear!=''){
                component.set("v.isVisible", true);
        }else{
                component.set("v.isVisible", false);
        }
    },
    onOpenModal: function(component, event, helper) {
        helper.openModal(component, event);
    },
    onCloseModal: function(component,event,helper){
        helper.closeModal(component, event);
    },
    onUpdateShop: function(component, event, helper) {
        helper.updateShop(component, event);
    },
    onDelete: function(component, event, helper){
        helper.deleteShop(component, event);
    },
    onInit: function(component, event, helper){
        helper.init(component, event);
    },
})