/**
 * Created by Majdan on 25.02.2019.
 */
({
  init : function(component, event, helper){
     helper.getAllProducts(component, event);
  },
  handleSelectProduct: function(component, event, helper){
      let product = component.find("productsList").get("v.value");
      if(product != ''){
          component.set("v.productSelected", true);
          component.set("v.parentId", product);
          helper.getProductPictures(component, event);
      }else {
          component.set("v.productSelected", false);
      }
  },
  doSave: function(component, event, helper) {
      if (component.find("fileId").get("v.files")) {
          helper.uploadHelper(component, event);
          setTimeout($A.getCallback(function(){
              helper.getProductPictures(component, event);
          }), 200);
      } else {
          alert($A.get('$Label.c.Select_file'));
      }
  },
  handleFilesChange: function(component, event, helper) {
      let fileName = $A.get('$Label.c.No_file_selected');
      if (event.getSource().get("v.files").length > 0) {
          fileName = event.getSource().get("v.files")[0]['name'];
      }
      component.set("v.fileName", fileName);
  },
  resetFileName: function(component, event, helper){
      component.set("v.fileName", $A.get('$Label.c.No_file_selected'));
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