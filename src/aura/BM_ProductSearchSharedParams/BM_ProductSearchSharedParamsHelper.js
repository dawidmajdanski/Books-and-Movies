/**
 * Created by Dawid Majdański on 05.02.2019.
 */
({
    selectSpecificYear: function(component){
        component.set("v.specificYear", this.selectYear(component, 'selectYearSpec1'));
    },
    selectMinYear: function(component){
        component.set("v.minYear", this.selectYear(component, 'selectYearMin1'));
    },
    selectMaxYear: function(component){
        component.set("v.maxYear", this.selectYear(component, 'selectYearMax1'));
    },
    selectYear: function(component, selectId){
        let selectYear = component.find(selectId).get('v.value');
        return selectYear;
    }
})