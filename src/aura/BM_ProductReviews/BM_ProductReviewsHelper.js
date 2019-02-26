/**
 * Created by Majdan on 06.02.2019.
 */
({
    getProductReviews: function(component, event){
        let product = component.get("v.productId");
        let action = component.get('c.getReviewsForSingleProduct');
        action.setParams({productId: product});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.reviews", response.getReturnValue());
          }else{
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Cannot_get_reviews'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
})