/**
 * Created by Majdan on 25.02.2019.
 */
({
  init : function(component, event, helper){
     helper.getCurrentPriceBooks(component);
  },
  handleChangeStartDate: function(component, event, helper){
      let action = component.get('c.changeStartDate');
      helper.changeDate(component, event, action, 'start_date');
  },
  handleChangeEndDate: function(component, event, helper){
      let action = component.get('c.changeEndDate');
      helper.changeDate(component, event, action, 'end_date');
  },
  handleRemoveSinglePromotionAction: function(component, event, helper){
      helper.removeSinglePromotionAction(component, event);
  },
  handleGetCurrentPriceBooks: function(component, event, helper){
      helper.getCurrentPriceBooks(component);
  },
})