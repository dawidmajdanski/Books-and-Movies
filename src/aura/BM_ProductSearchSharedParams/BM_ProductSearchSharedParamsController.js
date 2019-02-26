/**
 * Created by Dawid Majdański on 05.02.2019.
 */
({
    init: function(component, event, helper) {
        $A.enqueueAction(component.get("c.setYears"));
    },
    setYears: function(component, event, helper){
        let currentYear = (new Date()).getFullYear();
        let years = [];
        for(let i = currentYear; i>=1900; i--){
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
        component.find("selectYearSpec1").set("v.value", $A.get('$Label.c.Default_option'));
        component.find("selectYearMin1").set("v.value", $A.get('$Label.c.Default_option'));
        component.find("selectYearMax1").set("v.value", $A.get('$Label.c.Default_option'));
    }
})