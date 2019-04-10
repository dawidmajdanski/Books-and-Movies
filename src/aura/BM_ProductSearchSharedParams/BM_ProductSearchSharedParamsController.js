/**
 * Created by Dawid Majdański on 05.02.2019.
 */
({
    init: function(component, event) {
        $A.enqueueAction(component.get("c.setYears"));
    },
    setYears: function(component){
        let currentYear = (new Date()).getFullYear();
        let years = [];
        for(let i = currentYear; i>=1900; i--){
            years.push(i);
        }
        years.unshift($A.get('$Label.c.Default_option'));
        component.set("v.availableYears", years);
    },
    onSelectSpecificYear: function(component, event, helper){
        helper.selectSpecificYear(component);
    },
    onSelectMinYear: function(component, event, helper){
        helper.selectMinYear(component);
    },
    onSelectMaxYear: function(component, event, helper){
        helper.selectMaxYear(component);
    },
    clearAvailableYearsOption: function(component, event){
        component.find("selectYearSpec1").set("v.value", $A.get('$Label.c.Default_option'));
        component.find("selectYearMin1").set("v.value", $A.get('$Label.c.Default_option'));
        component.find("selectYearMax1").set("v.value", $A.get('$Label.c.Default_option'));
    }
})