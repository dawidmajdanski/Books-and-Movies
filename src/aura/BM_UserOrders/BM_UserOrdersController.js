/**
 * Created by Dawid Majdański on 12.02.2019.
 */
({
    init: function(component, event, helper){
        helper.searchForOrders(component, event);
    },
    handleRoll: function(component, event, helper){
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        var isRolledDown = component.get("v.isRolledDown");
        for(var i=0; i<component.get("v.myOrders").length; i++){
            document.getElementById(i).style='max-height: 0;';
            document.getElementById(i+'A').style='transform: rotate(0)';
            if(index.valueOf() != i.valueOf() ){
                 isRolledDown[i] = false;
            }
        }
        if(!isRolledDown[index]){
            document.getElementById(index).style='max-height: 650px;';
            document.getElementById(index+'A').style='transform: rotate(180deg)';
            isRolledDown[index] = true;
        }else{
            document.getElementById(index).style='max-height: 0;';
            document.getElementById(index+'A').style='transform: rotate(0)';
            isRolledDown[index] = false;
        }
        component.set("v.isRolledDown", isRolledDown);
    },
    handleItemClick: function(component, event, helper){
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        var record = selectedSection.dataset.record;
        var orderItemName;
        for(var j=0; j<component.get('v.myOrders')[index].OrderItems.length; j++){
             if(component.get('v.myOrders')[index].OrderItems[j].PricebookEntry.Name == record){
                 orderItemName = component.get('v.myOrders')[index].OrderItems[j].PricebookEntry.Name;
             }
        }
        helper.getOrderItem(component, event, orderItemName);
    },
    handleNextPage: function(component, event, helper){
        var pageNumber = event.currentTarget.dataset.record;
        pageNumber = parseInt(pageNumber, 10);
        var newOffset = 0;
        for(var i=0; i<pageNumber-1; i++){
            newOffset += component.get('v.resultsOnPageSize');
        }
        component.set('v.offset', newOffset);
        component.set('v.currentPageNum', pageNumber);
        var parsedItems = helper.splitResults(component, event, component.get('v.myOrdersBackup'));
        component.set('v.myOrders', parsedItems);
    },
    handlePreviousPage: function(component, event, helper){
        var pageNumber = event.currentTarget.dataset.record;
        pageNumber = parseInt(pageNumber, 10);
        var newOffset = component.get('v.offset');
        for(var i=0; i<Math.abs(pageNumber-component.get('v.currentPageNum')); i++){
            newOffset -= component.get('v.resultsOnPageSize');
        }
        component.set('v.offset', newOffset);
        component.set('v.currentPageNum', pageNumber);
        var parsedItems = helper.splitResults(component, event, component.get('v.myOrdersBackup'));
        component.set('v.myOrders', parsedItems);
    }

})