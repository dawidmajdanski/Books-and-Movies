/**
 * Created by Majdan on 27.02.2019.
 */
({
  doSearch: function(component){
      let action = component.get('c.searchForProducts');
      let products;
      action.setParams({searchObj : JSON.stringify(this.getQueryObject(component))});
      action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
              products = response.getReturnValue();
              component.set('v.offset', 0);
              component.set("v.products", this.splitResults(component, products));
              let resultsOnPageSize = component.get('v.resultsOnPageSize');
              component.set('v.maxPageNum', products.length%resultsOnPageSize==0?products.length/resultsOnPageSize:(Math.floor(products.length/resultsOnPageSize))+1);
              component.set('v.currentPageNum', 1);
              if(!component.get("v.searchByProductType")){
                  this.handleProductTypeFilters(component, products);
              }
          }else{
                console.error($A.get('$Label.c.Internal_error')+' '+state);
                component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
          }
          if(products.length!=0){
              component.set('v.noResults', false);
          }else{
              component.set('v.noResults', true);
          }
          sessionStorage.setItem('customSearch--records', JSON.stringify(products));
      });
      $A.enqueueAction(action);
  },
  handleProductTypeFilters: function(component, products){
        let productTypeObj = [{},{},{}];
        productTypeObj[0].name = $A.get('$Label.c.All_tab');
        productTypeObj[0].count = 0;
        for(let i=0; i<products.length; i++){
            productTypeObj[0].count += 1;
            if(products[i].productRecordType == $A.get('$Label.c.Book')){
                productTypeObj[1].name = $A.get('$Label.c.Books_tab');
                productTypeObj[1].count = 1 + (productTypeObj[1].count==undefined?0:productTypeObj[1].count);
            }
            if(products[i].productRecordType == $A.get('$Label.c.Movie')){
                productTypeObj[2].name = $A.get('$Label.c.Movies_tab');
                productTypeObj[2].count = 1 + (productTypeObj[2].count==undefined?0:productTypeObj[2].count);
            }
        }
        if(!productTypeObj[1].name){
            productTypeObj.splice(1,1);
            productTypeObj.splice(0,1);
        }else{
            if(!productTypeObj[2].name){
                productTypeObj.splice(2,1);
                productTypeObj.splice(0,1);
            }
        }
        component.set("v.productTypes", productTypeObj);
  },
  getCachedSearchParams: function(){
      return JSON.parse(sessionStorage.getItem('searchParams'));
  },
  getQueryObject: function(component){
      let queryObj = {
        "productType" : component.get("v.searchByProductType")==true?component.get("v.productType"):this.getCachedSearchParams().productType,
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
        "minRating" : component.get("v.minRating")
        };
      return queryObj;
  },
  getSearchParams: function(component){
        let searchParams = this.getCachedSearchParams();
        component.set("v.specificYear", searchParams.specificYear);
        component.set("v.searchText", searchParams.searchText);
        component.set("v.minPrice", searchParams.minPrice);
        component.set("v.maxPrice", searchParams.maxPrice);
        component.set("v.minYear", searchParams.minYear);
        component.set("v.maxYear", searchParams.maxYear);
        component.set("v.author", searchParams.author);
        component.set("v.director", searchParams.director);
        component.set("v.movieGenre", searchParams.movieGenre);
        component.set("v.bookGenre", searchParams.bookGenre);
        component.set("v.minRating", searchParams.minRating);
        this.handleProductTypeFilters(component, JSON.parse(sessionStorage.getItem('customSearch--records')));
  },
  splitResults: function(component, results){
      let currentPageResults = [];
      for(let i=component.get('v.offset'); i<component.get('v.offset')+component.get('v.resultsOnPageSize'); i++){
          if(i<=results.length-1 && i>=0){
              currentPageResults.push(results[i]);
          }
      }
      return currentPageResults;
  },
})