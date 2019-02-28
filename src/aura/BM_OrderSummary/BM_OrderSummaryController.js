/**
 * Created by Majdan on 10.02.2019.
 */
({
    init: function(component, event, helper){
        helper.initPageVisibility(component);
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
               helper.clearCart();
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