/**
 * Created by Majdan on 26.02.2019.
 */
({
    searchForProducts: function(component){
      let action = component.get('c.searchForProducts');
      let products;
      action.setParams({searchObj : JSON.stringify(this.getQueryObject(component))});
      action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              component.set("v.productsToDiscount", response.getReturnValue());
          }else{
              component.set("v.productsToDiscount", []);
              console.error($A.get('$Label.c.Internal_error')+' '+state);
              component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
      });
      $A.enqueueAction(action);
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
    getCurrentPriceBooks: function(component){
        let action = component.get('c.getPriceBooks');
        action.setCallback(this, function(response) {
             let state = response.getState();
             if (state === 'SUCCESS') {
                component.set("v.activePricebooks", response.getReturnValue());
                this.setActivePricebooksPicklist(component, response.getReturnValue());
             }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
             }
        });
        $A.enqueueAction(action);
    },
    setActivePricebooksPicklist: function(component, currentPricebooks){
        let activePricebooksPicklistValues = currentPricebooks;
        activePricebooksPicklistValues.unshift({'Name': $A.get('$Label.c.Pick_one_option')});
        component.set('v.activePricebooksPicklist', activePricebooksPicklistValues);
    },
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
          "pricebookName" : component.get("v.pricebookName"),
          "movieGenre" : component.get("v.movieGenre")
          };
      return queryObj;
    },
})