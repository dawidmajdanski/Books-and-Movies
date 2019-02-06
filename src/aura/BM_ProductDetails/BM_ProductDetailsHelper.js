/**
 * Created by Dawid Majdański on 06.02.2019.
 */
({
    getRatingForProduct: function(component, event){
        var product = component.get("v.product");
        let action = component.get('c.getRatingForSingleProduct');
        action.setParams({productId: product.productId});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
              var product = component.get("v.product");
              product.avgRating = response.getReturnValue().avgRating;
              product.countRating = response.getReturnValue().countRating;
              component.set("v.product", product);
          }
        });
        $A.enqueueAction(action);
    },
})