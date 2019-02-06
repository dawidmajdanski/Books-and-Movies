/**
 * Created by Dawid Majdański on 03.01.2019.
 */
({
   doneWaiting: function(component, event, helper) {
       component.set("v.HideSpinner", false);
   },
   waiting: function(component, event, helper) {
       component.set("v.HideSpinner", true);
   }
})