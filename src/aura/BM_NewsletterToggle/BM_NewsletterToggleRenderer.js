/**
 * Created by Dawid Majdański on 04.03.2019.
 */
({
    afterRender : function(component, helper) {
        component.set("v.userSubscribe", sessionStorage.getItem("user-sub"));
        if(component.get("v.userSubscribe")=='true'){
             helper.toggleOn(component);
        }
        this.superAfterRender();
    },
})
