/**
 * Created by Majdan on 27.02.2019.
 */
({
  init: function(component, event, helper) {
      let jsonItems = sessionStorage.getItem('customSearch--records');
      if (!$A.util.isUndefinedOrNull(jsonItems)) {
          let items = JSON.parse(jsonItems);
          let parsedItems = helper.splitResults(component, items);
          let resultsOnPageSize = component.get('v.resultsOnPageSize');
          component.set('v.maxPageNum', items.length%resultsOnPageSize==0?items.length/resultsOnPageSize:(Math.floor(items.length/resultsOnPageSize))+1);
          component.set('v.currentPageNum', 1);
          component.set('v.products', items);
          helper.getSearchParams(component);
          component.set('v.products', parsedItems);
          component.set("v.noResults", false);
      }
      if(jsonItems=='[]'){
          component.set('v.noResults', true);
      }
  },
  filterProductType: function(component, event, helper){
      let selectedSection = event.currentTarget;
      let record = selectedSection.dataset.record;
      component.set("v.productType", record);
      component.set("v.searchByProductType", true);
      helper.doSearch(component);
  },
  handleSearch: function(component, event, helper){
      component.set("v.searchByProductType", false);
      helper.doSearch(component);
  },
  handleNextPage: function(component, event, helper){
      let pageNumber = event.currentTarget.dataset.record;
      pageNumber = parseInt(pageNumber, 10);
      let newOffset = 0;
      for(let i=0; i<pageNumber-1; i++){
          newOffset += component.get('v.resultsOnPageSize');
      }
      component.set('v.offset', newOffset);
      component.set('v.currentPageNum', pageNumber);
      let parsedItems = helper.splitResults(component, JSON.parse(sessionStorage.getItem('customSearch--records')));
      component.set('v.products', parsedItems);
  },
  handlePreviousPage: function(component, event, helper){
      let pageNumber = event.currentTarget.dataset.record;
      pageNumber = parseInt(pageNumber, 10);
      let newOffset = component.get('v.offset');
      for(let i=0; i<Math.abs(pageNumber-component.get('v.currentPageNum')); i++){
          newOffset -= component.get('v.resultsOnPageSize');
      }
      component.set('v.offset', newOffset);
      component.set('v.currentPageNum', pageNumber);
      let parsedItems = helper.splitResults(component, JSON.parse(sessionStorage.getItem('customSearch--records')));
      component.set('v.products', parsedItems);
  }
})