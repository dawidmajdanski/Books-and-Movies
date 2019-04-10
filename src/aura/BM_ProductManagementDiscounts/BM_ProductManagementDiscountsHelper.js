/**
 * Created by Dawid Majdański on 28.02.2019.
 */
({
    singleProductDiscountChange: function(component, event){
      let selectedSection = event.currentTarget;
      let record = selectedSection.dataset.record;
      let pricebookId = selectedSection.dataset.index;
      let productId = [];
      productId.push(record);
      this.discountAction(component, productId, record, pricebookId);
    },
    addDiscountToAllProducts: function(component){
      let productIds = [];
      let productsToDiscount = component.get("v.productsToDiscount");
      for(let i=0; i<productsToDiscount.length; i++){
          productIds.push(productsToDiscount[i].productId);
      }
      this.discountAction(component, productIds, 'discountInput', component.get('v.selectedPricebook'));
    },
    discountAction: function(component, productIds, inputId, selectedPricebook){
      let action = component.get('c.addDiscountToProducts');
      action.setParams({pricebookId: selectedPricebook, ids: productIds, discount: document.getElementById(inputId).value});
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === 'SUCCESS') {
            this.updateResultsList(component, event);
            this.updatePricebooks(component, event);
        }else{
            console.error($A.get('$Label.c.Internal_error')+' '+state);
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Internal_error'), 'error');
        }
      });
      $A.enqueueAction(action);
    },
    updateResultsList: function(component, event){
        let updateEvt = component.getEvent("updateResults");
        updateEvt.fire();
    },
    updatePricebooks: function(component, event){
        let priceBooksEvt = $A.get("e.c:BM_GetPricebooksEvent");
        if(priceBooksEvt){
            priceBooksEvt.fire();
        }else {
            console.error('No such event: BM_GetPricebooksEvent');
        }
    },
})