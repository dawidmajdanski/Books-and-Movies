/**
 * Created by Majdan on 10.02.2019.
 */
({
    init: function(component, event, helper){
        if(sessionStorage.getItem('orderCompletedSuccessfully')){
            component.set('v.showPage', true);
            component.set('v.orderNumber', sessionStorage.getItem('orderNumber'));
            sessionStorage.removeItem('orderNumber');
            sessionStorage.removeItem('orderCompletedSuccessfully');
        }else{
            component.set("v.showPage", false);
            var navEvt = $A.get('e.force:navigateToURL');
            if(navEvt){
                navEvt.setParams({url: '/'});
                navEvt.fire();
            }
        }
        helper.bottomTitleAnimation(component, event);
    },
})