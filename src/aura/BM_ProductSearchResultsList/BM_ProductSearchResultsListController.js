/**
 * Created by Dawid Majdański on 31.01.2019.
 */
({
  init: function(component, event, helper) {
      var jsonItems = sessionStorage.getItem('customSearch--records');
      if (!$A.util.isUndefinedOrNull(jsonItems)) {
          var items = JSON.parse(jsonItems);
          var parsedItems = helper.splitResults(component, event, items);
          var resultsOnPageSize = component.get('v.resultsOnPageSize');
          component.set('v.maxPageNum', items.length%resultsOnPageSize==0?items.length/resultsOnPageSize:(Math.floor(items.length/resultsOnPageSize))+1);
          component.set('v.currentPageNum', 1);
          component.set('v.products', items);
          helper.getSearchParams(component, event);
          component.set('v.products', parsedItems);
          component.set("v.noResults", false);
      }
      if(jsonItems=='[]'){
          component.set('v.noResults', true);
      }
  },
  filterProductType: function(component, event, helper){
      var selectedSection = event.currentTarget;
      var record = selectedSection.dataset.record;
      component.set("v.productType", record);
      component.set("v.searchByProductType", true);
      helper.doSearch(component, event);
  },
  handleSearch: function(component, event, helper){
      component.set("v.searchByProductType", false);
      helper.doSearch(component, event);
  },
  handleNextPage: function(component, event, helper){
      var pageNumber = event.currentTarget.dataset.record;
      pageNumber = parseInt(pageNumber, 10);
      var newOffset = 0;
      for(var i=0; i<pageNumber-1; i++){
          newOffset += component.get('v.resultsOnPageSize');
      }
      component.set('v.offset', newOffset);
      component.set('v.currentPageNum', pageNumber);
      var parsedItems = helper.splitResults(component, event, JSON.parse(sessionStorage.getItem('customSearch--records')));
      component.set('v.products', parsedItems);
  },
  handlePreviousPage: function(component, event, helper){
      var pageNumber = event.currentTarget.dataset.record;
      pageNumber = parseInt(pageNumber, 10);
      var newOffset = component.get('v.offset');
      for(var i=0; i<Math.abs(pageNumber-component.get('v.currentPageNum')); i++){
          newOffset -= component.get('v.resultsOnPageSize');
      }
      component.set('v.offset', newOffset);
      component.set('v.currentPageNum', pageNumber);
      var parsedItems = helper.splitResults(component, event, JSON.parse(sessionStorage.getItem('customSearch--records')));
      component.set('v.products', parsedItems);
  }
})