/**
 * Created by Majdan on 09.02.2019.
 */
({
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
    getTotalCartPrice: function(component, event, cartProducts){
        var totalCartPrice = 0;
        for(var i=0; i<cartProducts.length; i++){
            let partialSum = 0;
            if(cartProducts[i].discountPrice){
                partialSum += cartProducts[i].quantity * cartProducts[i].discountPrice;
            }else{
                partialSum += cartProducts[i].quantity * cartProducts[i].productPrice;
            }
            totalCartPrice += partialSum;
        }
        component.set("v.totalCartPrice", totalCartPrice);
    },
    validateQuantityInput: function(value, inputId){
        var input = document.getElementById(inputId);
        if(!value || value<=0){
            input.classList.add("slds-input-customError");
            document.getElementById("proceedToDelivery").disabled = true;
            this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Wrong_quantity'), "error");
            return false;
        }else{
            input.classList.remove("slds-input-customError");
            document.getElementById("proceedToDelivery").disabled = false;
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