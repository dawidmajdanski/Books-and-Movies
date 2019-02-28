/**
 * Created by Majdan on 26.02.2019.
 */
({
  init : function(component, event, helper){
      helper.getInactivePriceBooks(component);
  },
  handleRemoveSinglePromotionAction: function(component, event, helper){
      helper.removeSinglePromotionAction(component, event);
  },
  handleChangeStartDate: function(component, event, helper){
      let action = component.get('c.changeStartDate');
      helper.changeDate(component, event, action, 'start_date');
  },
  handleChangeEndDate: function(component, event, helper){
      let action = component.get('c.changeEndDate');
      helper.changeDate(component, event, action, 'end_date');
  },
  handleGetLastPriceBooks: function(component, event, helper){
      helper.getInactivePriceBooks(component);
  },
})