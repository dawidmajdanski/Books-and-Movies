/**
 * Created by Dawid Majdański on 04.03.2019.
 */
({
  toggleSubscription: function(component, event, helper){
      let action = component.get('c.userSubscriptionChange');
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            let returnVal = response.getReturnValue();
            component.set('v.userSubscribe', returnVal);
            sessionStorage.setItem("user-sub", returnVal);
            if(returnVal){
                helper.toggleOn(component);
            }else{
                helper.toggleOff(component);
            }
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
  },
})