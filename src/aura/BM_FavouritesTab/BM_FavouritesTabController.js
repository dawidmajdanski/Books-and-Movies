/**
 * Created by Dawid Majdański on 26.02.2019.
 */
({
    handleMyOrders: function(event){
        let navEvt = $A.get('e.force:navigateToURL');
        if(navEvt){
            navEvt.setParams({url: '/favourites'});
            navEvt.fire();
        }
    },
})