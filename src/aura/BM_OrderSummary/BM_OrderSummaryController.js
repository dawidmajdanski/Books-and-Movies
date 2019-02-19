/**
 * Created by Majdan on 10.02.2019.
 */
({
    init: function(component, event, helper){
        if(sessionStorage.getItem('deliverySelectionDone')){
            component.set("v.showPage", true);
            component.set("v.shippingAddress", JSON.parse(sessionStorage.getItem('user--shipping')));
            $A.enqueueAction(component.get("c.getTotalOrderPrice"));
        }else{
            component.set("v.showPage", false);
            var navEvt = $A.get('e.force:navigateToURL');
            navEvt.setParams({url: '/'});
            navEvt.fire();
        }
    },
    getTotalOrderPrice: function(component, event, helper){
        component.set("v.productsToOrder", JSON.parse(localStorage.getItem('cartItems')));
        var productsToOrder = component.get("v.productsToOrder");
        var totalOrderPrice = 0;
        for(var i=0; i<productsToOrder.length; i++){
            if(productsToOrder[i].discountPrice){
                totalOrderPrice += productsToOrder[i].discountPrice * productsToOrder[i].quantity;
            }else{
                totalOrderPrice += productsToOrder[i].productPrice * productsToOrder[i].quantity;
            }
        }
        component.set("v.totalOrderPrice", totalOrderPrice);
    },
    handleFinalizeOrder: function(component, event, helper){
        var loading = component.find("loadingSpinner");
        if(loading){
              loading.waiting();
        }else{
            console.error('No such component: loadingSpinner');
        }
        let action = component.get('c.createOrder');
        action.setParams({productsToOrder: JSON.stringify(component.get("v.productsToOrder")), shippingAddress: JSON.stringify(component.get("v.shippingAddress"))});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
               helper.clearCart(component, event);
               sessionStorage.removeItem('user--shipping');
               sessionStorage.removeItem('user--info');
               sessionStorage.removeItem('itemsInCartAccepted');
               sessionStorage.removeItem('deliverySelectionDone');
               sessionStorage.removeItem('orderCompletedSuccessfully');
               sessionStorage.setItem('orderCompletedSuccessfully', true);
               sessionStorage.setItem('orderNumber', response.getReturnValue());
               var navEvt = $A.get('e.force:navigateToURL');
               navEvt.setParams({url: '/success'});
               navEvt.fire();
          }
        });
        $A.enqueueAction(action);
    },

})