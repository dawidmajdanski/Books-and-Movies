/**
 * Created by Majdan on 10.02.2019.
 */
({
    init: function(component, event, helper){
        if(sessionStorage.getItem('orderCompletedSuccessfully')){
            component.set("v.showPage", true);
            sessionStorage.removeItem('orderCompletedSuccessfully');
        }else{
            component.set("v.showPage", false);
            var navEvt = $A.get('e.force:navigateToURL');
            navEvt.setParams({url: '/'});
            navEvt.fire();
        }
    },
})