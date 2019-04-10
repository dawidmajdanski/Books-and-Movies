/**
 * Created by Dawid Majdański on 05.02.2019.
 */
({
    selectSpecificYear: function(component){
        component.set("v.specificYear", this.selectYear(component, 'selectYearSpec1'));
        this.checkSpecificYearDefaultValue(component);
    },
    selectMinYear: function(component){
        component.set("v.minYear", this.selectYear(component, 'selectYearMin1'));
        this.checkMinYearDefaultValue(component);
    },
    selectMaxYear: function(component){
        component.set("v.maxYear", this.selectYear(component, 'selectYearMax1'));
        this.checkMaxYearDefaultValue(component);
    },
    selectYear: function(component, selectId){
        let selectYear = component.find(selectId).get('v.value');
        return selectYear;
    },
    checkSpecificYearDefaultValue: function(component){
        if(component.get('v.specificYear')==$A.get('$Label.c.Default_option')){
            component.set('v.specificYear', '');
        }
    },
    checkMinYearDefaultValue: function(component){
        if(component.get('v.minYear')==$A.get('$Label.c.Default_option')){
            component.set('v.minYear', '');
        }
    },
    checkMaxYearDefaultValue: function(component){
        if(component.get('v.maxYear')==$A.get('$Label.c.Default_option')){
            component.set('v.maxYear', '');
        }
    },
})