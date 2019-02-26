/**
 * Created by Majdan on 26.02.2019.
 */
({
    searchForProducts: function(component, event){
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
    singleProductDiscountChange: function(component, event){
      let selectedSection = event.currentTarget;
      let record = selectedSection.dataset.record;
      let pricebookId = selectedSection.dataset.index;
      let productId = [];
      productId.push(record);
      this.discountAction(component, event, productId, record, pricebookId);
    },
    addDiscountToAllProducts: function(component, event){
      let productIds = [];
      let productsToDiscount = component.get("v.productsToDiscount");
      for(let i=0; i<productsToDiscount.length; i++){
          productIds.push(productsToDiscount[i].productId);
      }
      this.discountAction(component, event, productIds, 'discountInput', component.get('v.selectedPricebook'));
    },
    discountAction: function(component, event, productIds, inputId, selectedPricebook){
      let action = component.get('c.addDiscountToProducts');
      action.setParams({pricebookId: selectedPricebook, ids: productIds, discount: document.getElementById(inputId).value});
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            this.searchForProducts(component, event);
            let priceBooksEvt = $A.get("e.c:BM_GetPricebooksEvent");
            if(priceBooksEvt){
                priceBooksEvt.fire();
            }else {
                console.error('No such event: BM_GetPricebooksEvent');
            }
            component.set('v.selectedPricebook', null);
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    getMovieGenresPicklistValues: function(component, event, helper){
      let action = component.get('c.getMovieGenresEntries');
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            component.set("v.movieGenres", response.getReturnValue());
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    getBookGenresPicklistValues: function(component, event, helper){
      let action = component.get('c.getBookGenresEntries');
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            component.set("v.bookGenres", response.getReturnValue());
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    getCurrentPriceBooks: function(component, event){
        let action = component.get('c.getPriceBooks');
        action.setCallback(this, function(response) {
             let state = response.getState();
             if (state === 'SUCCESS') {
                component.set("v.activePricebooks", response.getReturnValue());
                component.set('v.selectedPricebook', component.get('v.activePricebooks')[0].Id);
             }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
             }
        });
        $A.enqueueAction(action);
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