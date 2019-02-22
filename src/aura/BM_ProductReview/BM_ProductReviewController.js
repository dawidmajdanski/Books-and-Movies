/**
 * Created by Majdan on 21.02.2019.
 */
({
    init: function(component, event, helper){
       $A.enqueueAction(component.get('c.getUserRating'));
       component.set("v.user", JSON.parse(sessionStorage.getItem('user--info')));
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
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
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
                  console.error($A.get('$Label.c.Internal_error')+' '+state);
                  component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
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
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
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
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
        helper.getAvgRatingForProduct(component, event);
    },
})