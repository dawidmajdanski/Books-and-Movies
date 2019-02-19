/**
 * Created by Majdan on 13.02.2019.
 */
({
    searchForOrders: function(component, event){
        var action = component.get('c.getMyOrders');
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
            var items =  response.getReturnValue();
            var parsedItems = this.splitResults(component, event, items);
            var resultsOnPageSize = component.get('v.resultsOnPageSize');
            component.set('v.maxPageNum', items.length%resultsOnPageSize==0?items.length/resultsOnPageSize:(Math.floor(items.length/resultsOnPageSize))+1);
            component.set('v.currentPageNum', 1);
            component.set("v.myOrders", parsedItems);
            component.set("v.myOrdersBackup", items);
            var isRolledDown = [];
            for(var i=0; i<component.get("v.myOrders").length; i++){
                isRolledDown[i] = false;
            }
            component.set("v.isRolledDown", isRolledDown);
          }
        });
        $A.enqueueAction(action);
    },
    getOrderItem: function(component, event, orderItemName){
        var action = component.get('c.getPricebookEntryProduct');
        action.setParams({'orderItemName' : orderItemName});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
             var productDetails = response.getReturnValue();
             sessionStorage.setItem('customSearch--record', JSON.stringify(productDetails));
             var navEvt = $A.get('e.force:navigateToURL');
             navEvt.setParams({url: '/details'});
             navEvt.fire();
          }
        });
        $A.enqueueAction(action);
    },
    splitResults: function(component, event, results){
        var currentPageResults = [];
        for(var i=component.get('v.offset'); i<component.get('v.offset')+component.get('v.resultsOnPageSize'); i++){
            if(i<=results.length-1 && i>=0){
                currentPageResults.push(results[i]);
            }
        }
        return currentPageResults;
    },
})