/**
 * Created by Majdan on 11.02.2019.
 */
({
    init: function(component, event, helper){
        let action = component.get('c.getPopularProducts');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set("v.products", response.getReturnValue());
            }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
            }
        });
        $A.enqueueAction(action);
    },
    handleProductClick: function(component, event, helper){
        helper.productClick(component, event);
    }
})