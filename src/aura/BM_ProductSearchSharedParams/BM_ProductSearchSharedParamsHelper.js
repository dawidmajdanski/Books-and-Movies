/**
 * Created by Dawid Majdański on 05.02.2019.
 */
({
    selectSpecificYear: function(component, event){
        component.set("v.specificYear", this.selectYear(component, event, 'selectYearSpec1'));
    },
    selectMinYear: function(component, event){
        component.set("v.minYear", this.selectYear(component, event, 'selectYearMin1'));
    },
    selectMaxYear: function(component, event){
        component.set("v.maxYear", this.selectYear(component, event, 'selectYearMax1'));
    },
    selectYear: function(component, event, selectId){
        let selectYear = component.find(selectId).get('v.value');
        return selectYear;
    }
})