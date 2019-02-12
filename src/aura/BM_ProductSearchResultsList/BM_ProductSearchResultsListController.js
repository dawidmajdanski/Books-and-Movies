/**
 * Created by Dawid Majdański on 31.01.2019.
 */
({
  init: function(component, event, helper) {
    var jsonItems = sessionStorage.getItem('customSearch--records');
    if (!$A.util.isUndefinedOrNull(jsonItems)) {
        var items = JSON.parse(jsonItems);
        component.set('v.products', items);
        //sessionStorage.removeItem('customSearch--records');
        component.set("v.noResults", false);
    }
    if(jsonItems=='[]'){
        component.set('v.noResults', true);
    }
  },

})