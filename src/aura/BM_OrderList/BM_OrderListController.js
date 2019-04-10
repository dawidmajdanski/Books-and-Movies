/**
 * Created by Dawid Majdański on 26.02.2019.
 */
({
    init: function(component, event, helper){
        helper.searchForOrders(component);
    },
    handleRollOrder: function(component, event, helper){
        component.set("v.isOrderRolledDown", helper.handleRoll(event, component.get("v.myOrders"), component.get("v.isOrderRolledDown"), 'OrderItem', 'OrderArrow'));
    },
    handleOrderItemClick: function(component, event, helper){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;
        let record = selectedSection.dataset.record;
        let orderItemName;
        for(let j=0; j<component.get('v.myOrders')[index].OrderItems.length; j++){
             if(component.get('v.myOrders')[index].OrderItems[j].PricebookEntry.Name == record){
                 orderItemName = component.get('v.myOrders')[index].OrderItems[j].PricebookEntry.Name;
             }
        }
        helper.getOrderItem(component, orderItemName);
    },
    handleGetOrderItem: function(component, event, helper){
        let orderItemName = event.getParam("orderItemName");
        helper.getOrderItem(component, orderItemName);
    },
    onOpenCaseForm: function(component, event, helper){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;
        let record = selectedSection.dataset.record;
        let selectedOrder = helper.getSelectedOrder(component, record);
        let selectedOrderItem = helper.getSelectedOrderItem(selectedOrder, index);
        let caseModal = component.find("newCaseForm");
        if(caseModal){
            caseModal.openCaseModal(selectedOrder, selectedOrderItem);
        }else{
            console.error('No such component: CaseForm');
        }
    },
    handleNextPage: function(component, event, helper){
        let pageNumber = event.currentTarget.dataset.record;
        pageNumber = parseInt(pageNumber, 10);
        let newOffset = 0;
        for(let i=0; i<pageNumber-1; i++){
            newOffset += component.get('v.resultsOnPageSize');
        }
        component.set('v.offset', newOffset);
        component.set('v.currentPageNum', pageNumber);
        let parsedItems = helper.splitResults(component, component.get('v.myOrdersBackup'));
        component.set('v.myOrders', parsedItems);
    },
    handlePreviousPage: function(component, event, helper){
        let pageNumber = event.currentTarget.dataset.record;
        pageNumber = parseInt(pageNumber, 10);
        let newOffset = component.get('v.offset');
        for(let i=0; i<Math.abs(pageNumber-component.get('v.currentPageNum')); i++){
            newOffset -= component.get('v.resultsOnPageSize');
        }
        component.set('v.offset', newOffset);
        component.set('v.currentPageNum', pageNumber);
        let parsedItems = helper.splitResults(component, component.get('v.myOrdersBackup'));
        component.set('v.myOrders', parsedItems);
    },
})