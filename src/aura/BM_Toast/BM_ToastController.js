/**
 * Created by Dawid Majdański on 22.02.2019.
 */
({
    handleToast: function(component, event){
        var params = event.getParam('arguments');
        var titleMessage = params.titleMessage;
        var errorName = params.errorName;
        var toastType = params.toastType;

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