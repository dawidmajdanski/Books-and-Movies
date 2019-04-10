/**
 * Created by Majdan on 03.02.2019.
 */
({
  productClick: function(component, event){
     sessionStorage.setItem('customSearch--record', JSON.stringify(component.get("v.product")));
     let navEvt = $A.get('e.force:navigateToURL');
    if(navEvt){
        navEvt.setParams({url: '/details'});
        navEvt.fire();
    }
  },
})