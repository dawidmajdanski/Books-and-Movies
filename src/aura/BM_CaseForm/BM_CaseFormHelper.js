/**
 * Created by Dawid Majdański on 20.02.2019.
 */
({
    openModal: function(component, event){
        let params = event.getParam('arguments');
        component.set("v.order", params.receivedOrder);
        component.set("v.orderItem", params.receivedOrderItem);

        let cmpTarget = component.find('CaseModalBox');
        let cmpBack = component.find('CaseModalBackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open');
    },
    closeModal: function(component, event){
        let cmpTarget = component.find('CaseModalBox');
        let cmpBack = component.find('CaseModalBackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
    },
    submitComplaint: function(component, event){
        let action = component.get('c.submitNewComplaint');
        action.setParams({
            orderObj: component.get('v.order'),
            orderItemObj: component.get('v.orderItem'),
            person: component.get('v.user'),
            caseSubject: component.get('v.caseSubject'),
            caseDescription: component.get('v.caseDescription')
            });
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
                component.set("v.caseDescription", '');
                component.set("v.caseSubject", '');
                this.closeModal(component, event);
                component.find("toastMsg").showToast($A.get('$Label.c.Success_toast_title'), $A.get('$Label.c.Complaint_sent'), 'success');
          }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
        });
        $A.enqueueAction(action);
    },
})