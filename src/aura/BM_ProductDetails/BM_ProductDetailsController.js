/**
 * Created by Majdan on 03.02.2019.
 */
({
    init: function(component, event, helper) {
        let jsonItem = sessionStorage.getItem('customSearch--record');
        let item = JSON.parse(jsonItem);
        component.set("v.product", item);
        $A.enqueueAction(component.get('c.getPicturesForProduct'));
    },
    sortPictures: function(component){
        let pics = component.get("v.pictures");
        let temp;
        for(var i=0; i<pics.length; i++){
            if(pics[i].pictureName.includes($A.get('$Label.c.Main_picture_name'))){
                temp=pics[0];
                pics[0]=pics[i];
                pics[i]=temp;
                break;
            }
        }
        component.set("v.pictures", pics);
    },
    handleAddToCart: function(component, event, helper){
       if(helper.validateQuantity(component, event)!=false){
           let cartItem = component.get('v.product');
           let parsedCartItemsToAdd = [];
           cartItem.quantity = component.get('v.quantity');
           if(localStorage.getItem('cartItems')){
               let cartItems = localStorage.getItem('cartItems');
               let parsedCartItems = JSON.parse(cartItems);
               for(let i=0; i<parsedCartItems.length; i++){
                   parsedCartItemsToAdd.push(parsedCartItems[i]);
               }
               localStorage.removeItem('cartItems');
           }
           parsedCartItemsToAdd.push(cartItem);
           localStorage.setItem('cartItems', JSON.stringify(parsedCartItemsToAdd));

           let updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
           if(updateQuantityEvt){
                updateQuantityEvt.fire();
           }else {
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), "Internal error. No such event: BM_ProductsCartQuantityEvent", 'error');
           }
       }
    },
    getPicturesForProduct: function(component, event){
        let product = component.get("v.product");
        let action = component.get('c.getPicturesForSingleProduct');
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.pictures", response.getReturnValue());
              $A.enqueueAction(component.get('c.sortPictures'));
          }else{
              console.error(response);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), state, 'error');
          }
        });
        $A.enqueueAction(action);
    },
})