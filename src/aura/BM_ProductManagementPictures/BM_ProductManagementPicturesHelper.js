/**
 * Created by Majdan on 25.02.2019.
 */
({
    MAX_FILE_SIZE: 4500000,
    CHUNK_SIZE: 750000,

    uploadHelper: function(component, event) {
        let fileInput = component.find("fileId").get("v.files");
        let file = fileInput[0];
        let self = this;
        if (file.size > self.MAX_FILE_SIZE) {
            component.set("v.fileName", $A.get('$Label.c.File_size_error1') + self.MAX_FILE_SIZE + $A.get('$Label.c.File_size_error2') + $A.get('$Label.c.File_size_error3') + file.size);
            return;
        }
        let objFileReader = new FileReader();
        objFileReader.onload = $A.getCallback(function() {
            let fileContents = objFileReader.result;
            let base64 = 'base64,';
            let dataStart = fileContents.indexOf(base64) + base64.length;
            fileContents = fileContents.substring(dataStart);
            self.uploadProcess(component, file, fileContents);
        });

        objFileReader.readAsDataURL(file);
    },
    uploadProcess: function(component, file, fileContents) {
        let startPosition = 0;
        let endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        let getchunk = fileContents.substring(startPosition, endPosition);
        let action = component.get("c.saveChunk");
        action.setParams({
            parentId: component.get("v.parentId"),
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });

        action.setCallback(this, function(response) {
            attachId = response.getReturnValue();
            let state = response.getState();
            if (state === "SUCCESS") {
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                }
            } else if (state === "INCOMPLETE") {
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Server_error') + response.getReturnValue(), 'error');
            } else if (state === "ERROR") {
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error($A.get('$Label.c.Internal_error')+ ' ' + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
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
        $A.enqueueAction(action);
    },
    deletePicture: function(component, event){
        let parentId = component.get('v.parentId');
        let selectedSection = event.currentTarget;
        let picId = selectedSection.dataset.record;
        let action = component.get('c.pictureDeletion');
        action.setParams({picToDel: picId, productId : parentId});
        $A.enqueueAction(action);
    },
})