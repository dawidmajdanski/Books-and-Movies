/**
 * Created by Majdan on 03.02.2019.
 */
({
    init: function(component, event, helper) {
        var jsonItem = sessionStorage.getItem('customSearch--record');
        var item = JSON.parse(jsonItem);
        component.set("v.product", item);

        $A.enqueueAction(component.get('c.getPicturesForProduct'));
       // $A.enqueueAction(component.get('c.getRatingForProduct'));
        helper.getRatingForProduct(component, event);
    },
    getPicturesForProduct: function(component, event){
        var product = component.get("v.product");
        var action = component.get('c.getPicturesForSingleProduct');
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
            component.set("v.pictures", response.getReturnValue());
            $A.enqueueAction(component.get('c.sortPicsOrder'));
          }
        });
        $A.enqueueAction(action);
    },
    sortPicsOrder: function(component){
        console.log('dupa');
        var pics = component.get("v.pictures");
        var temp;
        for(var i=0; i<pics.length; i++){
            if(pics[i].pictureName.includes("Main")){
                temp=pics[0];
                pics[0]=pics[i];
                pics[i]=temp;
                break;
            }
        }
        component.set("v.pictures", pics);
    },
})