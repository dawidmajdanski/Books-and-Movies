/**
 * Created by Majdan on 25.02.2019.
 */
({
    getAllProducts: function(component, event){
        let action = component.get("c.getProducts");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.products", response.getReturnValue());
            }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
            }
        });
        $A.enqueueAction(action);
    },
    getProductPictures: function(component, event){
        let parentId = component.get('v.parentId');
        let action = component.get('c.getPicturesForProduct');
        action.setParams({productId: parentId});
        action.setCallback(this, function(response) {
             let state = response.getState();
             if (state === 'SUCCESS') {
               let productPics = response.getReturnValue();
               component.set("v.productPictures", productPics);
             }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
             }
        });
        $A.enqueueAction(action);
    },
    setMainPicture: function(component, event){
        let parentId = component.get('v.parentId');
        let selectedSection = event.currentTarget;
        let picId = selectedSection.dataset.record;
        let action = component.get('c.updatePicturesNames');
        action.setParams({newMainPic: picId, productId : parentId});
        action.setCallback(this, function(response) {
             let state = response.getState();
             if (state === 'SUCCESS') {
                this.getProductPictures(component, event);
             }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
             }
        });
        $A.enqueueAction(action);
    },
    deletePicture: function(component, event){
        let parentId = component.get('v.parentId');
        let selectedSection = event.currentTarget;
        let picId = selectedSection.dataset.record;
        let action = component.get('c.pictureDeletion');
        action.setParams({picToDel: picId, productId : parentId});
        action.setCallback(this, function(response) {
             let state = response.getState();
             if (state === 'SUCCESS') {
                this.getProductPictures(component, event);
             }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
             }
        });
        $A.enqueueAction(action);
    },
})