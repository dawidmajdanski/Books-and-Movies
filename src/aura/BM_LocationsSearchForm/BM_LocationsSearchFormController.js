/**
 * Created by Dawid Majdański on 21.12.2018.
 */
({
   onSearch: function(component, event, helper) {
       helper.search(component, event);
       var loading = component.find("loadingSpinner");
       if(loading){
           loading.waiting();
       }else{
           console.errror('No such component: loadingSpinner');
       }
   },
   onClear: function(component, event, helper) {
       helper.clear(component, event);
   },
})