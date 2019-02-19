/**
 * Created by Majdan on 03.02.2019.
 */
({
    MAX_FILE_SIZE: 4500000,
    CHUNK_SIZE: 750000,

    uploadHelper: function(component, event) {
        var fileInput = component.find("fileId").get("v.files");
        var file = fileInput[0];
        var self = this;
        if (file.size > self.MAX_FILE_SIZE) {
            component.set("v.fileName", $A.get('$Label.c.File_size_error1') + self.MAX_FILE_SIZE + $A.get('$Label.c.File_size_error2') + $A.get('$Label.c.File_size_error3') + file.size);
            return;
        }
        var objFileReader = new FileReader();
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
            fileContents = fileContents.substring(dataStart);
            self.uploadProcess(component, file, fileContents);
        });

        objFileReader.readAsDataURL(file);
    },
    uploadProcess: function(component, file, fileContents) {
        var startPosition = 0;
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveChunk");
        action.setParams({
            parentId: component.get("v.parentId"),
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });

        action.setCallback(this, function(response) {
            attachId = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                }
            } else if (state === "INCOMPLETE") {
                alert($A.get('$Label.c.Server_error') + response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    getProductPictures: function(component, event){
        var parentId = component.get('v.parentId');
        var action = component.get('c.getPicturesForProduct');
        action.setParams({productId: parentId});
        action.setCallback(this, function(response) {
             var state = response.getState();
             if (state === 'SUCCESS') {
               var productPics = response.getReturnValue();
               component.set("v.productPictures", productPics);
             }
        });
        $A.enqueueAction(action);
    },
    setMainPicture: function(component, event){
        var parentId = component.get('v.parentId');
        var selectedSection = event.currentTarget;
        var picId = selectedSection.dataset.record;
        var action = component.get('c.updatePicturesNames');
        action.setParams({newMainPic: picId, productId : parentId});
        $A.enqueueAction(action);
    },
    deletePicture: function(component, event){
        var parentId = component.get('v.parentId');
        var selectedSection = event.currentTarget;
        var picId = selectedSection.dataset.record;
        var action = component.get('c.pictureDeletion');
        action.setParams({picToDel: picId, productId : parentId});
        $A.enqueueAction(action);
    },
    searchForProducts: function(component, event){
      var action = component.get('c.searchForProducts');
      var products;
      action.setParams({searchObj : JSON.stringify(this.getQueryObject(component))});
      action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.productsToDiscount", response.getReturnValue());
          }else{
              component.set("v.productsToDiscount", []);
          }
      });
      $A.enqueueAction(action);
    },
    manageCurrentPromo: function(component, event){
        document.getElementById('addPromo').style = 'background-color: none;';
        document.getElementById('currentPromo').style = 'background-color: #e8faff;';
        component.set("v.sideTabsetOption", 'currProm');
        this.getCurrentPromoProducts(component, event);
    },
    manageAddPromo: function(component, event){
        document.getElementById('currentPromo').style = 'background-color: none;';
        document.getElementById('addPromo').style = 'background-color: #e8faff;';
        component.set("v.sideTabsetOption", 'addProm');
    },
    getCurrentPromoProducts: function(component, event){
        var action = component.get('c.getPromoProducts');
        action.setCallback(this, function(response) {
             var state = response.getState();
             if (state === 'SUCCESS') {
                component.set("v.currentPromoProducts", response.getReturnValue());
             }
        });
        $A.enqueueAction(action);
    },
    removePromotionsAction: function(component, event, helper){
      var action = component.get('c.removePromotions');
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
            component.set("v.currentPromoProducts", []);
        }
      });
      $A.enqueueAction(action);
    },
    removeSinglePromotionAction: function(component, event, helper){
      var selectedSection = event.currentTarget;
      var record = selectedSection.dataset.record;
      var action = component.get('c.removeSinglePromotion');
      action.setParams({promoProductId: record});
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
            this.getCurrentPromoProducts(component, event);
        }
      });
      $A.enqueueAction(action);
    },
    addDiscountToAllProducts: function(component, event){
      var productIds = [];
      var productsToDiscount = component.get("v.productsToDiscount");
      for(var i=0; i<productsToDiscount.length; i++){
          productIds.push(productsToDiscount[i].productId);
      }
      this.discountAction(component, event, productIds, 'discountInput');
    },
    singleProductDiscountChange: function(component, event){
      var selectedSection = event.currentTarget;
      var record = selectedSection.dataset.record;
      var productId = [];
      productId.push(record);
      this.discountAction(component, event, productId, record);
    },
    discountAction: function(component, event, productIds, inputId){
      var action = component.get('c.addDiscountToProducts');
      action.setParams({ids: productIds, discount: document.getElementById(inputId).value});
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
            this.searchForProducts(component, event);
        }
      });
      $A.enqueueAction(action);
    },
    getQueryObject: function(component){
      var queryObj = {
          "productType" : component.get("v.productType"),
          "searchText" : component.get('v.searchText'),
          "minPrice" : component.get("v.minPrice"),
          "maxPrice" : component.get("v.maxPrice"),
          "specificYear" : component.get("v.specificYear"),
          "minYear" : component.get("v.minYear"),
          "maxYear" : component.get("v.maxYear"),
          "author" : component.get("v.author"),
          "director" : component.get("v.director"),
          "bookGenre" : component.get("v.bookGenre"),
          "movieGenre" : component.get("v.movieGenre"),
          };
      return queryObj;
    },
    getMovieGenresPicklistValues: function(component, event, helper){
      var action = component.get('c.getMovieGenresEntries');
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
            component.set("v.movieGenres", response.getReturnValue());
        }
      });
      $A.enqueueAction(action);
    },
    getBookGenresPicklistValues: function(component, event, helper){
      var action = component.get('c.getBookGenresEntries');
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
            component.set("v.bookGenres", response.getReturnValue());
        }
      });
      $A.enqueueAction(action);
    },
})