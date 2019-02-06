/**
 * Created by Dawid Majdański on 05.02.2019.
 */
({
    init: function(component, event, helper) {
        $A.enqueueAction(component.get("c.setYears"));
    },
    setYears: function(component, event, helper){
        var currentYear = (new Date()).getFullYear();
        var years = [];
        for(var i = currentYear; i>=1900; i--){
            years.push(i);
        }
        component.set("v.availableYears", years);
    },
    onSelectSpecificYear: function(component, event, helper){
        helper.selectSpecificYear(component, event);
    },
    onSelectMinYear: function(component, event, helper){
        helper.selectMinYear(component, event);
    },
    onSelectMaxYear: function(component, event, helper){
        helper.selectMaxYear(component, event);
    },
    clearAvailableYearsOption: function(component, event, helper){
        component.find("selectYearSpec1").set("v.value", '--none--');
        component.find("selectYearMin1").set("v.value", '--none--');
        component.find("selectYearMax1").set("v.value", '--none--');
    }
})