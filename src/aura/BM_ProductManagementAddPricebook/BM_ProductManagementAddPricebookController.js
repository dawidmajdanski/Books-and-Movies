/**
 * Created by Majdan on 26.02.2019.
 */
({
  addNewPricebook: function(component, event){
      let action = component.get('c.createNewPricebook');
      action.setParams({newPricebook: component.get('v.newPricebook')});
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
              let priceBooksEvt = $A.get("e.c:BM_GetPricebooksEvent");
              if(priceBooksEvt){
                  priceBooksEvt.fire();
              }else {
                  console.error('No such event: BM_GetPricebooksEvent');
              }
              component.set('v.newPricebook', null);
              component.find("toastMsg").showToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Price book created!'), 'success');
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
  },

})