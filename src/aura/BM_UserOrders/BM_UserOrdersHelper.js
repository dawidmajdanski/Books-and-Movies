/**
 * Created by Majdan on 13.02.2019.
 */
({
    searchForOrders: function(component, event){
        let action = component.get('c.getMyOrders');
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              let items =  response.getReturnValue();
              let parsedItems = this.splitResults(component, event, items);
              let resultsOnPageSize = component.get('v.resultsOnPageSize');
              component.set('v.maxPageNum', items.length%resultsOnPageSize==0?items.length/resultsOnPageSize:(Math.floor(items.length/resultsOnPageSize))+1);
              component.set('v.currentPageNum', 1);
              component.set("v.myOrders", parsedItems);
              component.set("v.myOrdersBackup", items);
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
    searchForUserComplaints: function(component, event){
        let action = component.get('c.getMyComplaints');
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              let results = JSON.parse(response.getReturnValue());
              component.set("v.complaints", this.parseDates(component, results));
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
    parseDates: function(component, results){
        for(let i=0; i<results.length; i++){
            let date = new Date(results[i].CreatedDate.split(' ')[0]);
            results[i].CreatedDate = date.toLocaleDateString("en-GB");
            date = results[i].ClosedDate?new Date(results[i].ClosedDate.split(' ')[0]):null;
            results[i].ClosedDate = date?date.toLocaleDateString("en-GB"):null;
            date = new Date(results[i].Order__r.CreatedDate.split(' ')[0]);
            results[i].Order__r.CreatedDate = date.toLocaleDateString("en-GB");
            if(results[i].Histories){
                 for(let j=0; j<results[i].Histories.records.length; j++){
                    date = new Date(results[i].Histories.records[j].CreatedDate.split(' ')[0]);
                    results[i].Histories.records[j].CreatedDate = date.toLocaleDateString("en-GB");
                 }
            }
            for(let j=0; j<results[i].EmailMessages.records.length; j++){
                 date = new Date(results[i].EmailMessages.records[j].CreatedDate.split(' ')[0]);
                 results[i].EmailMessages.records[j].CreatedDate = date.toLocaleDateString("en-GB");
            }
        }
        return results;
    },
    getOrderItem: function(component, event, orderItemName){
        let action = component.get('c.getPricebookEntryProduct');
        action.setParams({'orderItemName' : orderItemName});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
             let productDetails = response.getReturnValue();
             sessionStorage.setItem('customSearch--record', JSON.stringify(productDetails[0]));
             let navEvt = $A.get('e.force:navigateToURL');
             if(navEvt){
                 navEvt.setParams({url: '/details'});
                 navEvt.fire();
             }
          }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');               
          }
        });
        $A.enqueueAction(action);
    },
    splitResults: function(component, event, results){
        let currentPageResults = [];
        for(let i=component.get('v.offset'); i<component.get('v.offset')+component.get('v.resultsOnPageSize'); i++){
            if(i<=results.length-1 && i>=0){
                currentPageResults.push(results[i]);
            }
        }
        return currentPageResults;
    },
    getSelectedOrder: function(component, orderId){
        let myOrders = component.get("v.myOrders");
        for(let i=0; i<myOrders.length; i++){
            if(myOrders[i].Id == orderId){
                return myOrders[i];
            }
        }
        return null;
    },
    getSelectedOrderItem: function(component, order, orderItemId){
        for(let i=0; i<order.OrderItems.length; i++){
            if(order.OrderItems[i].Id == orderItemId){
                return order.OrderItems[i];
            }
        }
        return null;
    },
    handleRoll: function(component, event, objList, isRolledDown, divIdSuffix, arrowIdSuffix){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;

        for(let i=0; i<objList.length; i++){
            document.getElementById(i+divIdSuffix).style='max-height: 0;';
            document.getElementById(i+arrowIdSuffix).style='transform: rotate(0)';
            if(index.valueOf() != i.valueOf() ){
                 isRolledDown[i] = false;
            }
        }
        if(!isRolledDown[index]){
            document.getElementById(index+divIdSuffix).style='max-height: 850px;';
            document.getElementById(index+arrowIdSuffix).style='transform: rotate(180deg)';
            isRolledDown[index] = true;
        }else{
            document.getElementById(index+divIdSuffix).style='max-height: 0;';
            document.getElementById(index+arrowIdSuffix).style='transform: rotate(0)';
            isRolledDown[index] = false;
        }
        return isRolledDown;
    },
})