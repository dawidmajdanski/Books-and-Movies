/**
 * Created by Dawid Majdański on 07.03.2019.
 */
({
    init: function(component, event, helper) {
        let action = component.get('c.getAllShops');
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
                let getAllShopsEvt = $A.get("e.c:BM_LocationsSearchEvent");
                if(getAllShopsEvt){
                    getAllShopsEvt.setParams({"shopsResultList" : response.getReturnValue()});
                    getAllShopsEvt.fire();
                }else {
                    console.error('No such event: BM_LocationsSearchEvent');
                }
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
})