/**
 * Created by Dawid Majdański on 04.02.2019.
 */
({
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
    advancedSearchModalAppearance: function(component, event){
        var isAdvSearchDisplayed = component.get("v.isAdvSearchDisplayed");
        if(isAdvSearchDisplayed){
            this.hideAdvancedSearchModal(component, event);
        }else{
            this.showAdvancedSearchModal(component, event);
        }
    },
    showAdvancedSearchModal: function(component, event){
        var modal = document.getElementById('advSearchModal');
        var arrowContainer = document.getElementById('arrowDiv');
        modal.classList.add('displayModal');
        modal.classList.remove('hideModal');
        arrowContainer.classList.add('rotate90ArrowContainer');
        arrowContainer.classList.remove('rotate0ArrowContainer');
        component.set("v.isAdvSearchDisplayed", true);
    },
    hideAdvancedSearchModal: function(component, event){
        var modal = document.getElementById('advSearchModal');
        var arrowContainer = document.getElementById('arrowDiv');
        modal.classList.add('hideModal');
        modal.classList.remove('displayModal');
        arrowContainer.classList.add('rotate0ArrowContainer');
        arrowContainer.classList.remove('rotate90ArrowContainer');
        component.set("v.isAdvSearchDisplayed", false);
    },
    handleToast: function(titleMessage, errorName, toastType){
        var toastParams = {
            title: titleMessage,
            message: errorName,
            type: toastType
        };
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
    checkIfMaxPriceLesserThanMin: function(component, event, helper){
        if(Math.floor(component.get("v.maxPrice"))<Math.floor(component.get("v.minPrice"))){
            this.handleToast($A.get('$Label.c.Error_toast_title'), "Final price cannot be lesser than initial", "error");
            return false;
        }else{
            return true;
        }
    },
    checkIfMaxYearLesserThanMin: function(component, event, helper){
        if(component.get("v.maxYear")<component.get("v.minYear")){
            this.handleToast($A.get('$Label.c.Error_toast_title'), "Final year cannot be lesser than initial", "error");
            return false;
        }else{
            return true;
        }
    },

})