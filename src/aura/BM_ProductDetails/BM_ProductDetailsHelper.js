/**
 * Created by Dawid Majdański on 06.02.2019.
 */
({
    validateQuantity: function(component){
        let quantity = component.get("v.quantity");
        if(!quantity || quantity<=0){
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Quantity_not_valid'), 'error');
            return false;
        }
    },
    getProductById: function(component){
        let currURL = decodeURIComponent(window.location.search.substring(1));
        let productId = currURL.match(/[^(id=)].+/);
        if(currURL.includes('id') && productId){
           let queryObj = {
               "productType" : 'All',
               "productId" : productId[0],
               };
           let action = component.get('c.searchProductById');
           action.setParams({searchObj: JSON.stringify(queryObj)});
           action.setCallback(this, function(response) {
               let state = response.getState();
               if (state === 'SUCCESS') {
                  sessionStorage.setItem('customSearch--record', JSON.stringify(response.getReturnValue()[0]));
                  this.getPicturesForProduct(component);
                  return true;
               }else{
                  console.error(response);
                 component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), state, 'error');
               }
           });
           $A.enqueueAction(action);
        }
    },
    getPicturesForProduct: function(component){
        let jsonItem = sessionStorage.getItem('customSearch--record');
        if(jsonItem){
            let product = JSON.parse(jsonItem);
            component.set("v.product", product);
            let action = component.get('c.getPicturesForSingleProduct');
            action.setParams({productId: product.productId});
            action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === 'SUCCESS') {
                    component.set("v.pictures", response.getReturnValue());
                    $A.enqueueAction(component.get('c.sortPictures'));
                }else{
                    console.error(response);
                    component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), state, 'error');
                }
            });
            $A.enqueueAction(action);
        }
    },
})