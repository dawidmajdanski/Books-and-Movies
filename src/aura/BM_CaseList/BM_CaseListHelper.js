/**
 * Created by Dawid Majdański on 26.02.2019.
 */
({
    searchForUserComplaints: function(component){
        console.log('test');
        let action = component.get('c.getMyComplaints');
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              let results = JSON.parse(response.getReturnValue());
              component.set("v.complaints", this.parseDates(results));
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
    parseDates: function(results){
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
    handleRoll: function(event, objList, isRolledDown, divIdSuffix, arrowIdSuffix){
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
    getOrderItem: function(orderItemName){
        let orderItemNameEvt = $A.get("e.c:BM_GetOrderItemEvent");
        if(orderItemNameEvt){
            orderItemNameEvt.setParams({"orderItemName" : orderItemName});
            orderItemNameEvt.fire();
        }else {
            console.error('No such event: BM_GetOrderItemEvent');
        }
    },
})