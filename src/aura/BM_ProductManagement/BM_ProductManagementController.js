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
     helper.getCurrentPromoProducts(component, event);
     helper.getMovieGenresPicklistValues(component, event);
     helper.getBookGenresPicklistValues(component, event);
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
      var fileName = $A.get('$Label.c.No_file_selected');
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
  handleCurrentPromo: function(component, event, helper){
      helper.manageCurrentPromo(component, event);
  },
  handleAddPromo: function(component, event, helper){
      helper.manageAddPromo(component, event);
  },
  handleRemovePromotions: function(component, event, helper){
      helper.removePromotionsAction(component, event);
  },
  handleRemoveSinglePromotionAction: function(component, event, helper){
      helper.removeSinglePromotionAction(component, event);
  },
  handleAddDiscountToAllProducts: function(component, event, helper){
      helper.addDiscountToAllProducts(component, event);
  },
  handleSingleProductDiscountChange: function(component, event, helper){
      helper.singleProductDiscountChange(component, event);
  },
  handleChangeTabset: function(component, event, helper){
      $A.enqueueAction(component.get('c.handleClear'));
  },
  handleClear: function(component, event, helper){
      component.set("v.productsToDiscount", []);
      component.set("v.minPrice", undefined);
      component.set("v.maxPrice", undefined);
      component.set("v.minRating", undefined);
      component.set("v.specificYear", undefined);
      component.set("v.minYear", undefined);
      component.set("v.maxYear", undefined);
      component.set("v.director", undefined);
      component.set("v.author", undefined);
      component.set("v.bookGenre", undefined);
      component.set("v.movieGenre", undefined);
      $A.enqueueAction(component.get('c.resetToDefaultAvailableYears'));
      $A.enqueueAction(component.get('c.resetToDefaultGenres'));
  },
  handleSearch: function(component, event, helper){
      helper.searchForProducts(component, event);
  },
  handleMovieGenreChange: function(component, event, helper){
      component.set("v.movieGenre", component.find('selectMovieGenre').get('v.value'));
  },
  handleBookGenreChange: function(component, event, helper){
      component.set("v.bookGenre", component.find('selectBookGenre').get('v.value'));
  },
  resetToDefaultAvailableYears: function(component, event, helper){
      var clearAvailYears = component.find("clearAvailableYears");
      clearAvailYears.resetYearsPicklist();
      var clearAvailYears1 = component.find("clearAvailableYears1");
      clearAvailYears1.resetYearsPicklist();
      var clearAvailYears2 = component.find("clearAvailableYears2");
      clearAvailYears2.resetYearsPicklist();
  },
  resetToDefaultGenres: function(component, event, helper){
      component.find("selectBookGenre").set("v.value", $A.get('$Label.c.All_genres'));
      component.find("selectMovieGenre").set("v.value", $A.get('$Label.c.All_genres'));
  },

})