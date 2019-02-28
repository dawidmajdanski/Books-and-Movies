/**
 * Created by Majdan on 03.02.2019.
 */
({
  handleCurrentPromo: function(component, event, helper){
      helper.manageCurrentPromo(component);
  },
  handleLastPromo: function(component, event, helper){
      helper.manageLastPromo(component);
  },
  handleAddPromo: function(component, event, helper){
      helper.manageAddPromo(component);
  },
  handleAddPricebook: function(component, event, helper){
      helper.manageAddPricebook(component);
  },
  resetToDefaultAvailableYears: function(component){
      var clearAvailYears = component.find("clearAvailableYears");
      clearAvailYears.resetYearsPicklist();
      var clearAvailYears1 = component.find("clearAvailableYears1");
      clearAvailYears1.resetYearsPicklist();
      var clearAvailYears2 = component.find("clearAvailableYears2");
      clearAvailYears2.resetYearsPicklist();
  },
  resetToDefaultGenres: function(component){
      component.find("selectBookGenre").set("v.value", $A.get('$Label.c.All_genres'));
      component.find("selectMovieGenre").set("v.value", $A.get('$Label.c.All_genres'));
  },

})