/**
 * Created by Majdan on 09.02.2019.
 */
({
    getTotalCartPrice: function(component, cartProducts){
        let totalCartPrice = 0;
        for(let i=0; i<cartProducts.length; i++){
            let partialSum = 0;
            partialSum += cartProducts[i].quantity * cartProducts[i].price;
            totalCartPrice += partialSum;
        }
        component.set("v.totalCartPrice", totalCartPrice);
    },
    validateQuantityInput: function(value, inputId){
        let input = document.getElementById(inputId);
        if(!value || value<=0){
            input.classList.add("slds-input-customError");
            document.getElementById("proceedToDelivery").disabled = true;
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Wrong_quantity'), 'error');
            return false;
        }else{
            input.classList.remove("slds-input-customError");
            document.getElementById("proceedToDelivery").disabled = false;
        }
    },
})