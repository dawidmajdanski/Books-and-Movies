/**
 * Created by Majdan on 11.02.2019.
 */
({
  productClick: function(component, event){
     let selectedSection = event.currentTarget;
     let record = selectedSection.dataset.record;
     let product;
     for(let i=0; i<component.get("v.products").length; i++){
         if(component.get("v.products")[i].productId == record){
             product = component.get("v.products")[i];
             break;
         }
     }
     sessionStorage.setItem('customSearch--record', JSON.stringify(product));
     let navEvt = $A.get('e.force:navigateToURL');
     if(navEvt){
         navEvt.setParams({url: '/details'});
         navEvt.fire();
     }
  },
})