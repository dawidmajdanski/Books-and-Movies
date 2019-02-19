/**
 * Created by Majdan on 11.02.2019.
 */
({
    init: function(component, event, helper){
        var action = component.get('c.getPopularProducts');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set("v.products", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    handleProductClick: function(component, event, helper){
        helper.productClick(component, event);
    }
})