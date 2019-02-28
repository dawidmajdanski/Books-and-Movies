/**
 * Created by Majdan on 26.02.2019.
 */
({
    removeSinglePromotionAction: function(component, event){
      let selectedSection = event.currentTarget;
      let record = selectedSection.dataset.record;
      let action = component.get('c.removeSinglePromotion');
      action.setParams({promoProductId: record});
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            let priceBooksEvt = $A.get("e.c:BM_GetPricebooksEvent");
            if(priceBooksEvt){
                priceBooksEvt.fire();
            }else {
                console.error('No such event: BM_GetPricebooksEvent');
            }
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    getInactivePriceBooks: function(component){
        let action = component.get('c.getInactivePriceBooks');
        action.setCallback(this, function(response) {
             let state = response.getState();
             if (state === 'SUCCESS') {
                component.set("v.inactivePricebooks", response.getReturnValue());
             }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
             }
        });
        $A.enqueueAction(action);
    },
    changeDate: function(component, event, action, dateOption){
      let selectedSection = event.currentTarget;
      let record = selectedSection.dataset.record;
      let index = selectedSection.dataset.index;
      action.setParams({priceBookId: record, newDate: document.getElementById(index).value});
      action.setCallback(this, function(response) {
            if(dateOption=='start_date'){
                this.startDateChange(component, response);
            }else{
                if(dateOption=='end_date'){
                    this.endDateChange(component, response);
                }
            }
      });
      $A.enqueueAction(action);
    },
    startDateChange: function(component, response){
        let state = response.getState();
        if (state === 'SUCCESS') {
           component.find("toastMsg").showToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Start_date_changed'), 'success');
           let priceBooksEvt = $A.get("e.c:BM_GetPricebooksEvent");
           if(priceBooksEvt){
               priceBooksEvt.fire();
           }else {
               console.error('No such event: BM_GetPricebooksEvent');
           }
        }else{
           console.error($A.get('$Label.c.Internal_error')+' '+state);
           component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Pick_a_start_date'), 'info');
        }
    },
    endDateChange: function(component, response){
        let state = response.getState();
        if (state === 'SUCCESS') {
           component.find("toastMsg").showToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.End_date_changed'), 'success');
           let priceBooksEvt = $A.get("e.c:BM_GetPricebooksEvent");
           if(priceBooksEvt){
               priceBooksEvt.fire();
           }else {
               console.error('No such event: BM_GetPricebooksEvent');
           }
        }else{
           console.error($A.get('$Label.c.Internal_error')+' '+state);
           component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Pick_a_end_date'), 'info');
        }
    },
})