/**
 * Created by Dawid Majdański on 06.02.2019.
 */
({
    getAvgRatingForProduct: function(component, event){
        if(component.get("v.product")){
            var product = component.get("v.product").productId;
            let action = component.get('c.getRatingForSingleProduct');
            action.setParams({productId: product});
            action.setCallback(this, function(response) {
              var state = response.getState();
              if (state === 'SUCCESS') {
                  var product = component.get("v.product");
                  product.averageRating = response.getReturnValue().averageRating;
                  product.countRating = response.getReturnValue().countRating;
                  component.set("v.product", product);
              }
            });
            $A.enqueueAction(action);
        }
    },
    validateReview: function(component, event){
        if(!component.get("v.newVote")){
            this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Vote_error'), "error");
            return false;
        }
    },
    validateQuantity: function(component, event){
        var quantity = component.get("v.quantity");
        if(!quantity || quantity<=0){
            this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Quantity_not_valid'), "error");
            return false;
        }
    },
    handleToast: function(titleMessage, errorName, toastType){
        var toastParams = {
            title: titleMessage,
            message: errorName,
            type: toastType
        };
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
})