/**
 * Created by Dawid Majdański on 26.02.2019.
 */
({
    getUserCases: function(component, event, helper){
        helper.searchForUserComplaints(component);
    },
    handleRollCase: function(component, event, helper){
        component.set("v.isCaseRolledDown", helper.handleRoll(event, component.get("v.complaints"), component.get("v.isCaseRolledDown"), 'CaseItem', 'CaseArrow'));
    },
    handleCaseItemClick: function(component, event, helper){
        let selectedSection = event.currentTarget;
        let record = selectedSection.dataset.record;
        let orderItemName;
        for(let j=0; j<component.get('v.complaints').length; j++){
             if(component.get('v.complaints')[j].Order_Product__r.Product2.Name == record){
                 orderItemName = component.get('v.complaints')[j].Order_Product__r.Product2.Name;
             }
        }
        helper.getOrderItem(orderItemName);
    },
})