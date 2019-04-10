/**
 * Created by Majdan on 21.02.2019.
 */
({
    updateAvgRating: function(component, event){
        let avgRatingEvt = $A.get("e.c:BM_ProductRatingEvent");
        if(avgRatingEvt){
           avgRatingEvt.fire();
        }else {
           component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), "Internal error. No such event: BM_ProductRatingEvent", 'error');
        }
    },
    getAvgRatingForProduct: function(component, event){
        if(component.get("v.product")){
            let product = component.get("v.product").productId;
            let action = component.get('c.getRatingForSingleProduct');
            action.setParams({productId: product});
            action.setCallback(this, function(response) {
              let state = response.getState();
              if (state === 'SUCCESS') {
                  let product = component.get("v.product");
                  product.averageRating = response.getReturnValue().averageRating;
                  product.countRating = response.getReturnValue().countRating;
                  component.set("v.product", product);
              }else{
                  console.error($A.get('$Label.c.Internal_error')+' '+state);
                  component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
              }
            });
            $A.enqueueAction(action);
        }
    },
    validateReview: function(component, event){
        if(!component.get("v.newVote")){
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Vote_error'), 'error');
            return false;
        }
    },
})