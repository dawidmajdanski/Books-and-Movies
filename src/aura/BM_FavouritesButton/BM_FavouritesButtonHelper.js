/**
 * Created by Majdan on 27.02.2019.
 */
({
    manageUserFavouriteProduct: function(component, action, successLabel, option){
        let product = component.get('v.product');
        product.isFavourite = option;
        component.set('v.product', product);
        sessionStorage.setItem('customSearch--record', JSON.stringify(product));
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              component.find("toastMsg").showToast('', successLabel, 'success');
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
})