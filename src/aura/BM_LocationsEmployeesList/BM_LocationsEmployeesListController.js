/**
 * Created by Dawid Majdański on 04.01.2019.
 */
({
    handleGetEmployees: function(component, event, helper){
        var action = component.get("c.getEmployees");
        action.setParams({acc : component.get("v.shop")});
        action.setCallback(this, function(response) {
        var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.employees", response.getReturnValue());
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                       console.error("Error message: " +
                                 errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    handleRemoveEmployee: function(component, event, handler){
        var selectedSection = event.currentTarget;
        var record = selectedSection.dataset.record;
        var shop = component.get("v.shop");
        var employees = component.get("v.employees");

        var action = component.get("c.removeEmployeeFromShop");
        action.setParams({empId : record});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                employees.splice(employees.indexOf(response.getReturnValue()), 1);
                component.set("v.employees", employees);
                    this.handleToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Toast_employee_remove_success'), "success");
            } else {
                var errors = response.getError();
                if (errors) {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Toast_employee_remove_error'), "error");
                } else {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Unknown_error'), "error");
                }
            }
        });
        $A.enqueueAction(action);
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