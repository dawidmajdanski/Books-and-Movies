/**
 * Created by Majdan on 06.02.2019.
 */
({
    getProductReviews: function(component, event){
        var product = component.get("v.productId");
        let action = component.get('c.getReviewsForSingleProduct');
        action.setParams({productId: product});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.reviews", response.getReturnValue());
          }
        });
        $A.enqueueAction(action);
    },
})