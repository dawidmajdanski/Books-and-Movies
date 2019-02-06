/**
 * Created by Majdan on 02.01.2019.
 */
({
     getAllShops : function(component, event){
        var action = component.get("c.getShops");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.shops", response.getReturnValue());
            } else {
                var errors = response.getError();
                if (errors) {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Toast_error_on_get_shops'), "error");
                } else {
                    this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Unknown_error'), "error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    getAllEmployees : function(component, event){
        var action = component.get("c.getEmployees");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.allEmployees", response.getReturnValue());
            } else {
                this.handleErrors(response);
            }
        });
        $A.enqueueAction(action);
    },
    getAllAssignedEmployees : function(component, event){
        var action = component.get("c.getAssignedEmployees");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.assignedEmployees", response.getReturnValue());
            } else {
                this.handleErrors(response);
            }
        });
        $A.enqueueAction(action);
    },
    assign: function(component, event){
        var employee = component.find("employeesList");
        if(employee){
            employee = employee.get("v.value");
            var shop = component.find("shopsList").get("v.value");
            var action = component.get("c.assignEmployeeToShop");
            action.setParams({"empId" : employee, "shopId" : shop});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var assignedEmployees = component.get("v.assignedEmployees");
                    assignedEmployees.push(response.getReturnValue());
                    component.set("v.assignedEmployees", assignedEmployees);
                    this.checkIfEmployeeIsAssigned(component, event);
                    this.handleToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Toast_success_emp_assigned'), "success");
                } else {
                    var errors = response.getError();
                    if (errors) {
                        this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Assign_employee_error'), "error");
                    } else {
                        this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Unknown_error'), "error");
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            console.error('Could not find id: employeesList');
        }
    },
    checkIfEmployeeIsAssigned: function(component, event){
        var shop = component.find("shopsList").get("v.value");
        var assignedEmployees = component.get("v.assignedEmployees");
        var allEmployees = component.get("v.allEmployees");
        var availableEmployees = [];

        for(let i=0; i<allEmployees.length; i++){
            availableEmployees.push(allEmployees[i]);
        }

        for(let i = 0; i < assignedEmployees.length; i++){
            for(let j = 0; j < allEmployees.length; j++){
                if(assignedEmployees[i].Shop__c == shop && assignedEmployees[i].Employee__c == allEmployees[j].Id){
                    availableEmployees.splice( availableEmployees.indexOf(allEmployees[j]), 1 );
                }
            }
        }
        component.set("v.availableEmployees", availableEmployees);
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
    handleErrors: function(response){
        var errors = response.getError();
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.error("Error message: " +
                    errors[0].message);
                }
        } else {
            console.error("Unknown error");
        }
    },

})