/**
 * Created by Dawid Majdański on 20.02.2019.
 */
({
    init: function(component, event, helper){
        component.set("v.user", JSON.parse(sessionStorage.getItem('user--info')));
    },
    onOpenModal: function(component, event, helper) {
        helper.openModal(component, event);
    },
    onCloseModal: function(component,event,helper){
        helper.closeModal(component, event);
    },
    onSubmitComplaint: function(component, event, helper){
        helper.submitComplaint(component, event);
    },
})