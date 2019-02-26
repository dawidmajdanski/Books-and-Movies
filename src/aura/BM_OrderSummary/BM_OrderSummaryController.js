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
            let navEvt = $A.get('e.force:navigateToURL');
            if(navEvt){
                navEvt.setParams({url: '/'});
                navEvt.fire();
            }
        }
    },
    getTotalOrderPrice: function(component, event, helper){
        component.set("v.productsToOrder", JSON.parse(localStorage.getItem('cartItems')));
        let productsToOrder = component.get("v.productsToOrder");
        let totalOrderPrice = 0;
        for(let i=0; i<productsToOrder.length; i++){
            totalOrderPrice += productsToOrder[i].price * productsToOrder[i].quantity;
        }
        component.set("v.totalOrderPrice", totalOrderPrice);
    },
    handleFinalizeOrder: function(component, event, helper){
        let loading = component.find("loadingSpinner");
        if(loading){
              loading.waiting();
        }else{
            console.error('No such component: loadingSpinner');
        }
        let action = component.get('c.createOrder');
        action.setParams({productsToOrder: JSON.stringify(component.get("v.productsToOrder")), shippingAddress: JSON.stringify(component.get("v.shippingAddress"))});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
               helper.clearCart(component, event);
               sessionStorage.removeItem('user--shipping');
               sessionStorage.removeItem('itemsInCartAccepted');
               sessionStorage.removeItem('deliverySelectionDone');
               sessionStorage.removeItem('orderCompletedSuccessfully');
               sessionStorage.setItem('orderCompletedSuccessfully', true);
               sessionStorage.setItem('orderNumber', response.getReturnValue());
               let navEvt = $A.get('e.force:navigateToURL');
               if(navEvt){
                   navEvt.setParams({url: '/success'});
                   navEvt.fire();
               } 
          }
        });
        $A.enqueueAction(action);
    },

})