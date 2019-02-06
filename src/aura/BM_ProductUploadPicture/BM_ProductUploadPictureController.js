/**
 * Created by Majdan on 03.02.2019.
 */
({
  init : function(component, event, helper){
     var action = component.get("c.getProducts");
     action.setCallback(this, function(response) {
         var state = response.getState();
         if (state === "SUCCESS") {
             component.set("v.products", response.getReturnValue());
         }
     });
     $A.enqueueAction(action);
  },
  handleSelectProduct: function(component, event, helper){
      var product = component.find("productsList").get("v.value");
      if(product != ''){
          component.set("v.productSelected", true);
          component.set("v.parentId", product);
          helper.getProductPictures(component, event);
      }else {
          component.set("v.productSelected", false);
      }
      console.log(product);
  },
  doSave: function(component, event, helper) {
      console.log("do save invoke");
      if (component.find("fileId").get("v.files")) {
          helper.uploadHelper(component, event);
          setTimeout($A.getCallback(function(){
              helper.getProductPictures(component, event);
          }), 200);
      } else {
          alert('Please Select a File');
      }
  },
  handleFilesChange: function(component, event, helper) {
      var fileName = 'No File Selected..';
      if (event.getSource().get("v.files").length > 0) {
          fileName = event.getSource().get("v.files")[0]['name'];
      }
      component.set("v.fileName", fileName);
  },
  resetFileName: function(component, event, helper){
      component.set("v.fileName", "No File Selected..");
  },
  onSetMainPicture: function(component, event, helper){
      helper.setMainPicture(component, event);
      setTimeout($A.getCallback(function(){
          helper.getProductPictures(component, event);
      }), 100);
  },
  onDeletePicture: function(component, event, helper){
      helper.deletePicture(component, event);
      setTimeout($A.getCallback(function(){
          helper.getProductPictures(component, event);
      }), 100);
  },
})