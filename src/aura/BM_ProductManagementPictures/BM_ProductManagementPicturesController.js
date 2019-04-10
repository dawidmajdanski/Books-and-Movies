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
  onSetMainPicture: function(component, event, helper){
      helper.setMainPicture(component, event);
  },
  onDeletePicture: function(component, event, helper){
      helper.deletePicture(component, event);
  },
})