/**
 * Created by Dawid Majdański on 28.02.2019.
 */
({
  init : function(component, event, helper){
      component.set('v.selectedPricebook', component.get('v.activePricebooks')[0].Id);
  },
  handleSingleProductDiscountChange: function(component, event, helper){
      helper.singleProductDiscountChange(component, event);
  },
  handleAddDiscountToAllProducts: function(component, event, helper){
      helper.addDiscountToAllProducts(component);
  },
  handlePricebookSelect: function(component, event){
      let pricebookSelection = component.find('pricebookSelection').get("v.value");
      component.set("v.selectedPricebook", pricebookSelection);
  },
})