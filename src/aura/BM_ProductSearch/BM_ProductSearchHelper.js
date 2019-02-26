/**
 * Created by Dawid Majdański on 04.02.2019.
 */
({
    getQueryObject: function(component){
      let queryObj = {
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
      sessionStorage.setItem('searchParams', JSON.stringify(queryObj));

      return queryObj;
    },
    getCurrentUser: function(component, event){
        if(!sessionStorage.getItem('user--info')){
            let action = component.get("c.getLoggedUser");
            action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === 'SUCCESS') {
                   sessionStorage.setItem('user--info', JSON.stringify(response.getReturnValue()));
                }else{
                   console.error($A.get('$Label.c.Internal_error')+' '+state);
                   component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
                }
            });
            $A.enqueueAction(action);
        }
    },
    advancedSearchModalAppearance: function(component, event){
        let isAdvSearchDisplayed = component.get("v.isAdvSearchDisplayed");
        if(isAdvSearchDisplayed){
            this.hideAdvancedSearchModal(component, event);
        }else{
            this.showAdvancedSearchModal(component, event);
        }
    },
    showAdvancedSearchModal: function(component, event){
        let modal = document.getElementById('advSearchModal');
        let arrowContainer = document.getElementById('arrowDiv');
        modal.classList.add('displayModal');
        modal.classList.remove('hideModal');
        arrowContainer.classList.add('rotate90ArrowContainer');
        arrowContainer.classList.remove('rotate0ArrowContainer');
        component.set("v.isAdvSearchDisplayed", true);
    },
    hideAdvancedSearchModal: function(component, event){
        let modal = document.getElementById('advSearchModal');
        let arrowContainer = document.getElementById('arrowDiv');
        modal.classList.add('hideModal');
        modal.classList.remove('displayModal');
        arrowContainer.classList.add('rotate0ArrowContainer');
        arrowContainer.classList.remove('rotate90ArrowContainer');
        component.set("v.isAdvSearchDisplayed", false);
    },
    checkIfMaxPriceLesserThanMin: function(component, event, helper){
        if(Math.floor(component.get("v.maxPrice"))<Math.floor(component.get("v.minPrice"))){
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Price_error'), 'error');
            return false;
        }else{
            return true;
        }
    },
    checkIfMaxYearLesserThanMin: function(component, event, helper){
        if(component.get("v.maxYear")<component.get("v.minYear")){
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Years_error'), 'error');
            return false;
        }else{
            return true;
        }
    },
})