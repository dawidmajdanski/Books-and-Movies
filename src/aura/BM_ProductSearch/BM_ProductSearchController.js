/**
 * Created by Dawid Majdański on 31.01.2019.
 */
({
    init: function(component, event, helper){
        $A.enqueueAction(component.get('c.getMovieGenresPicklistValues'));
        $A.enqueueAction(component.get('c.getBookGenresPicklistValues'));
    },
    handleClick : function(component, event, helper) {
      if(!helper.checkIfMaxPriceLesserThanMin(component, event, helper) || !helper.checkIfMaxYearLesserThanMin(component, event, helper)){
          return false;
      }

      var action = component.get('c.searchForProducts');
      var products;
      action.setParams({searchObj : JSON.stringify(helper.getQueryObject(component))});
      action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
              products = response.getReturnValue();
          }else{
              products = [];
          }
          sessionStorage.setItem('customSearch--records', JSON.stringify(products));
          var navEvt = $A.get('e.force:navigateToURL');
          navEvt.setParams({url: '/search-results'});
          navEvt.fire();
      });
      $A.enqueueAction(action);
      helper.hideAdvancedSearchModal(component, event);
    },
    handleChangeTabset: function(component, event, helper){
        $A.enqueueAction(component.get('c.handleClearParams'));
    },
    handleClearParams: function(component, event, helper){
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
    resetToDefaultAvailableYears: function(component, event, helper){
        var clearAvailYears = component.find("clearAvailableYears");
        clearAvailYears.resetYearsPicklist();
        var clearAvailYears1 = component.find("clearAvailableYears1");
        clearAvailYears1.resetYearsPicklist();
        var clearAvailYears2 = component.find("clearAvailableYears2");
        clearAvailYears2.resetYearsPicklist();
    },
    resetToDefaultGenres: function(component, event, helper){
        component.find("selectBookGenre").set("v.value", 'All genres');
        component.find("selectMovieGenre").set("v.value", 'All genres');
    },
    onAdvancedSearchModalAppearance: function(component, event, helper){
        helper.advancedSearchModalAppearance(component, event);
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
    handleMovieGenreChange: function(component, event, helper){
        component.set("v.movieGenre", component.find('selectMovieGenre').get('v.value'));
    },
    handleBookGenreChange: function(component, event, helper){
        component.set("v.bookGenre", component.find('selectBookGenre').get('v.value'));
    },

})