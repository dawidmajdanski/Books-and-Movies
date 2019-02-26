/**
 * Created by Majdan on 22.02.2019.
 */
({
    handleMyOrders: function(component, event, helper){
        let navEvt = $A.get('e.force:navigateToURL');
        if(navEvt){
            navEvt.setParams({url: '/my-orders'});
            navEvt.fire();
        }
    },
})