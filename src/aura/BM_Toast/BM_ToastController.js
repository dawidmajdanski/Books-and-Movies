/**
 * Created by Dawid Majdański on 22.02.2019.
 */
({
    handleToast: function(component, event){
        let params = event.getParam('arguments');
        let titleMessage = params.titleMessage;
        let errorName = params.errorName;
        let toastType = params.toastType;

        let toastParams = {
            title: titleMessage,
            message: errorName,
            type: toastType
        };
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
})