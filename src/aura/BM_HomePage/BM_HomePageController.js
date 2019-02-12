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
                var products = component.get("v.products");
                for(var i=0; i<products.length; i++){
                    if(products[i].discountPrice){
                      products[i].discountPercentage = -Math.round(100 - ((products[i].discountPrice*100)/products[i].productPrice));
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    handleProductClick: function(component, event, helper){
        helper.productClick(component, event);
    }
})