/**
 * Created by Dawid Majdański on 31.01.2019.
 */
({
    init: function(component, event, helper){
        $A.enqueueAction(component.get('c.getMovieGenresPicklistValues'));
        $A.enqueueAction(component.get('c.getBookGenresPicklistValues'));
        helper.getCurrentUser(component);
    },
    handleClick : function(component, event, helper) {
      let isPricingCorrect = helper.checkIfMaxPriceLesserThanMin(component);
      let isYearsCorrect = helper.checkIfMaxYearLesserThanMin(component);
      if(!isPricingCorrect || !isYearsCorrect){
          return false;
      }

      let action = component.get('c.searchForProducts');
      let products;
      action.setParams({searchObj : JSON.stringify(helper.getQueryObject(component))});
      action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              products = response.getReturnValue();
          }else{
              products = [];
          }
          sessionStorage.setItem('customSearch--records', JSON.stringify(products));
          let navEvt = $A.get('e.force:navigateToURL');
          if(navEvt){
              navEvt.setParams({url: '/search-results'});
              navEvt.fire();
          }
      });
      $A.enqueueAction(action);
      helper.hideAdvancedSearchModal(component);
    },
    handleChangeTabset: function(component, event, helper){
        $A.enqueueAction(component.get('c.handleClearParams'));
    },
    handleClearParams: function(component, event){
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
        component.set("v.searchText", undefined);
        $A.enqueueAction(component.get('c.resetToDefaultAvailableYears'));
        $A.enqueueAction(component.get('c.resetToDefaultGenres'));
    },
    resetToDefaultAvailableYears: function(component){
        let clearAvailYears = component.find("clearAvailableYears");
        clearAvailYears.resetYearsPicklist();
        let clearAvailYears1 = component.find("clearAvailableYears1");
        clearAvailYears1.resetYearsPicklist();
        let clearAvailYears2 = component.find("clearAvailableYears2");
        clearAvailYears2.resetYearsPicklist();
    },
    resetToDefaultGenres: function(component){
        component.find("selectBookGenre").set("v.value", $A.get('$Label.c.All_genres'));
        component.find("selectMovieGenre").set("v.value", $A.get('$Label.c.All_genres'));
    },
    onAdvancedSearchModalAppearance: function(component, event, helper){
        helper.advancedSearchModalAppearance(component);
    },
    getMovieGenresPicklistValues: function(component){
      let action = component.get('c.getMovieGenresEntries');
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            let movieGenres = response.getReturnValue();
            movieGenres.unshift($A.get('$Label.c.All_genres'));
            component.set("v.movieGenres", movieGenres);
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    getBookGenresPicklistValues: function(component){
      let action = component.get('c.getBookGenresEntries');
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            let bookGenres = response.getReturnValue();
            bookGenres.unshift($A.get('$Label.c.All_genres'));
            component.set("v.bookGenres", bookGenres);
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    handleMovieGenreChange: function(component, event){
        component.set("v.movieGenre", component.find('selectMovieGenre').get('v.value'));
    },
    handleBookGenreChange: function(component, event){
        component.set("v.bookGenre", component.find('selectBookGenre').get('v.value'));
    },
})