/**
 * Created by Majdan on 26.02.2019.
 */
({
  init : function(component, event, helper){
     helper.getMovieGenresPicklistValues(component, event);
     helper.getBookGenresPicklistValues(component, event);
     helper.getCurrentPriceBooks(component, event);
  },
  handleChangeTabset: function(component, event, helper){
      $A.enqueueAction(component.get('c.handleClear'));
  },
  handleClear: function(component, event, helper){
      component.set("v.productsToDiscount", []);
      component.set("v.minPrice", undefined);
      component.set("v.maxPrice", undefined);
      component.set("v.minRating", undefined);
      component.set("v.pricebookName", undefined);
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
  resetToDefaultAvailableYears: function(component, event, helper){
      let clearAvailYears = component.find("clearAvailableYears");
      clearAvailYears.resetYearsPicklist();
      let clearAvailYears1 = component.find("clearAvailableYears1");
      clearAvailYears1.resetYearsPicklist();
      let clearAvailYears2 = component.find("clearAvailableYears2");
      clearAvailYears2.resetYearsPicklist();
  },
  resetToDefaultGenres: function(component, event, helper){
      component.find("selectBookGenre").set("v.value", $A.get('$Label.c.All_genres'));
      component.find("selectMovieGenre").set("v.value", $A.get('$Label.c.All_genres'));
  },
  handlePricebookParam: function(component, event, helper){
      component.set('v.pricebookName', component.find('pricebookNameSearch').get('v.value'));
  },
  handleBookGenreChange: function(component, event, helper){
      component.set("v.bookGenre", component.find('selectBookGenre').get('v.value'));
  },
  handleMovieGenreChange: function(component, event, helper){
      component.set("v.movieGenre", component.find('selectMovieGenre').get('v.value'));
  },
  handleSearch: function(component, event, helper){
      helper.searchForProducts(component, event);
  },
  handleSingleProductDiscountChange: function(component, event, helper){
      helper.singleProductDiscountChange(component, event);
  },
  handlePricebookSelect: function(component, event, helper){
      let pricebookSelection = component.find('pricebookSelection').get("v.value");
      component.set("v.selectedPricebook", pricebookSelection);
  },
  handleAddDiscountToAllProducts: function(component, event, helper){
      helper.addDiscountToAllProducts(component, event);
  },
})