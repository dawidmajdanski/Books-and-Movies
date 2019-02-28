/**
 * Created by Majdan on 26.02.2019.
 */
({
    getUserFavouriteProducts: function(component){
        let action = component.get('c.getAllUserFavouriteProducts');
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
                if(response.getReturnValue().length==0){
                    component.set("v.products", undefined);
                }else{
                    component.set("v.products", response.getReturnValue());
                }
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
})