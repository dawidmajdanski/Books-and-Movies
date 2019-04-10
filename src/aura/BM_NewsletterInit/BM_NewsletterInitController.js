/**
 * Created by Dawid Majdański on 04.03.2019.
 */
({
  init : function(component, event, helper){
    let action = component.get('c.getUserSubscriptionStatus');
    action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            sessionStorage.setItem("user-sub", response.getReturnValue());
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
    });
    $A.enqueueAction(action);
  },
})