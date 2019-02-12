/**
 * Created by Majdan on 03.02.2019.
 */
({
    init: function(component, event, helper) {
        var jsonItem = sessionStorage.getItem('customSearch--record');
        var item = JSON.parse(jsonItem);
        component.set("v.product", item);

        $A.enqueueAction(component.get('c.getPicturesForProduct'));
        $A.enqueueAction(component.get('c.getUser'));
        $A.enqueueAction(component.get('c.getUserRating'));
    },
    sortPicsOrder: function(component){
        console.log('dupa');
        var pics = component.get("v.pictures");
        var temp;
        for(var i=0; i<pics.length; i++){
            if(pics[i].pictureName.includes("Main")){
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
            var action = component.get('c.saveReviewForProduct');
            action.setParams({newComment: component.get("v.newComment"), newVote: component.get("v.newVote"), productId: component.get("v.product").productId, userId: component.get("v.user").Id});
            action.setCallback(this, function(response) {
              var state = response.getState();
              if (state === 'SUCCESS') {
                  component.set("v.userRating", response.getReturnValue());
                  var avgRatingEvt = $A.get("e.c:BM_ProductRatingEvent");
                  if(avgRatingEvt){
                      avgRatingEvt.fire();
                  }else {
                      console.error('No such event: BM_ProductRatingEvent');
                  }
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
        var action = component.get('c.updateReviewForProduct');

        action.setParams({reviewId: component.get("v.userRating").Id, newComment: component.get("v.userRating").Review__c, newVote: component.get("v.userRating").Rating__c});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
              var avgRatingEvt = $A.get("e.c:BM_ProductRatingEvent");
              if(avgRatingEvt){
                  avgRatingEvt.fire();
              }else {
                  console.error('No such event: BM_ProductRatingEvent');
              }
              component.set("v.editReviewMode", false);
          }
        });
        $A.enqueueAction(action);
        helper.getAvgRatingForProduct(component, event);
    },
    handleCancelEdit: function(component, event, helper){
        component.set("v.editReviewMode", false);
    },
    handleDeleteReview: function(component, event, helper){
        var action = component.get('c.deleteProductReview');
        action.setParams({productId: component.get("v.product").productId, userId: component.get("v.user").Id});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.userRating", null);
              component.set("v.newVote", 0);
              component.set("v.newComment", '');
              var avgRatingEvt = $A.get("e.c:BM_ProductRatingEvent");
              if(avgRatingEvt){
                  avgRatingEvt.fire();
              }else {
                  console.error('No such event: BM_ProductRatingEvent');
              }
          }
        });
        $A.enqueueAction(action);
        helper.getAvgRatingForProduct(component, event);
    },
    handleAddToCart: function(component, event, helper){
       if(helper.validateQuantity(component, event)!=false){
           var cartItem = component.get('v.product');
           var parsedCartItemsToAdd = [];
           cartItem.quantity = component.get('v.quantity');
           if(localStorage.getItem('cartItems')){
               var cartItems = localStorage.getItem('cartItems');
               var parsedCartItems = JSON.parse(cartItems);
               for(var i=0; i<parsedCartItems.length; i++){
                   parsedCartItemsToAdd.push(parsedCartItems[i]);
               }
               localStorage.removeItem('cartItems');
           }
           parsedCartItemsToAdd.push(cartItem);
           localStorage.setItem('cartItems', JSON.stringify(parsedCartItemsToAdd));

           var updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
           if(updateQuantityEvt){
                updateQuantityEvt.fire();
           }else {
                console.error('No such event: BM_ProductsCartQuantityEvent');
           }
       }
    },
    getPicturesForProduct: function(component, event){
        var product = component.get("v.product");
        var action = component.get('c.getPicturesForSingleProduct');
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
            component.set("v.pictures", response.getReturnValue());
            $A.enqueueAction(component.get('c.sortPicsOrder'));
          }
        });
        $A.enqueueAction(action);
    },
    getUserRating: function(component, event){
        var product = component.get("v.product");
        let action = component.get('c.getUserRatingForProduct');
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
                console.log(response.getReturnValue());
                component.set("v.userRating", response.getReturnValue());
          }
        });
        $A.enqueueAction(action);
    },
    getUser: function(component, event){
        let action = component.get('c.getLoggedUser');
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
                component.set("v.user", response.getReturnValue());
          }
        });
        $A.enqueueAction(action);
    },
})