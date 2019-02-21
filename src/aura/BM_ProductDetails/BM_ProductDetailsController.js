/**
 * Created by Majdan on 03.02.2019.
 */
({
    init: function(component, event, helper) {
        let jsonItem = sessionStorage.getItem('customSearch--record');
        let item = JSON.parse(jsonItem);
        component.set("v.product", item);
        component.set("v.user", JSON.parse(sessionStorage.getItem('user--info')));
        $A.enqueueAction(component.get('c.getPicturesForProduct'));
        $A.enqueueAction(component.get('c.getUserRating'));
    },
    sortPicsOrder: function(component){
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
    handleSaveReview: function(component, event, helper){
        if(helper.validateReview(component, event)!=false){
            let action = component.get('c.saveReviewForProduct');
            action.setParams({newComment: component.get("v.newComment"), newVote: component.get("v.newVote"), productId: component.get("v.product").productId, userId: component.get("v.user").Id});
            action.setCallback(this, function(response) {
              let state = response.getState();
              if (state === 'SUCCESS') {
                  component.set("v.userRating", response.getReturnValue());
                  helper.updateAvgRating(component, event);
              }else{
                  helper.handleToast($A.get('$Label.c.Error_toast_title'), state, "error");
              }
            });
            $A.enqueueAction(action);
            helper.getAvgRatingForProduct(component, event);
        }
    },
    handleEditReview: function(component, event, helper){
        component.set("v.editReviewMode", true);
    },
    handleUpdateReview: function(component, event, helper){
        let action = component.get('c.updateReviewForProduct');

        action.setParams({reviewId: component.get("v.userRating").Id, newComment: component.get("v.userRating").Review__c, newVote: component.get("v.userRating").Rating__c});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              helper.updateAvgRating(component, event);
              component.set("v.editReviewMode", false);
          }else{
              helper.handleToast($A.get('$Label.c.Error_toast_title'), state, "error");
          }
        });
        $A.enqueueAction(action);
        helper.getAvgRatingForProduct(component, event);
    },
    handleCancelEdit: function(component, event, helper){
        component.set("v.editReviewMode", false);
    },
    handleDeleteReview: function(component, event, helper){
        let action = component.get('c.deleteProductReview');
        action.setParams({productId: component.get("v.product").productId, userId: component.get("v.user").Id});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.userRating", null);
              component.set("v.newVote", 0);
              component.set("v.newComment", '');
              helper.updateAvgRating(component, event);
          }else{
              helper.handleToast($A.get('$Label.c.Error_toast_title'), state, "error");
          }
        });
        $A.enqueueAction(action);
        helper.getAvgRatingForProduct(component, event);
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
                helper.handleToast($A.get('$Label.c.Error_toast_title'), "Internal error. No such event: BM_ProductsCartQuantityEvent", "error");
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
              $A.enqueueAction(component.get('c.sortPicsOrder'));
          }else{
              helper.handleToast($A.get('$Label.c.Error_toast_title'), state, "error");
          }
        });
        $A.enqueueAction(action);
    },
    getUserRating: function(component, event){
        let product = component.get("v.product");
        let action = component.get('c.getUserRatingForProduct');
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.userRating", response.getReturnValue());
          }else{
              helper.handleToast($A.get('$Label.c.Error_toast_title'), state, "error");
          }
        });
        $A.enqueueAction(action);
    },
})