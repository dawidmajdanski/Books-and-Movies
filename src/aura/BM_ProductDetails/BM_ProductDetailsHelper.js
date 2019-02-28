/**
 * Created by Dawid Majdański on 06.02.2019.
 */
({
    validateQuantity: function(component){
        let quantity = component.get("v.quantity");
        if(!quantity || quantity<=0){
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Quantity_not_valid'), 'error');
            return false;
        }
    },
})