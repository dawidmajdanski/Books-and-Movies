/**
 * Created by Majdan on 03.02.2019.
 */
({
    manageCurrentPromo: function(component){
        document.getElementById('addPromo').style = 'background-color: none;';
        document.getElementById('lastPromo').style = 'background-color: none;';
        document.getElementById('addPricebook').style = 'background-color: none;';
        document.getElementById('currentPromo').style = 'background-color: rgba(27, 82, 151, 1); color: white;';
        component.set("v.sideTabsetOption", 'currProm');
    },
    manageLastPromo: function(component){
        document.getElementById('addPromo').style = 'background-color: none;';
        document.getElementById('addPricebook').style = 'background-color: none;';
        document.getElementById('currentPromo').style = 'background-color: none;';
        document.getElementById('lastPromo').style = 'background-color: rgba(27, 82, 151, 1); color: white;';
        component.set("v.sideTabsetOption", 'lastPromo');
    },
    manageAddPromo: function(component){
        document.getElementById('currentPromo').style = 'background-color: none;';
        document.getElementById('addPricebook').style = 'background-color: none;';
        document.getElementById('lastPromo').style = 'background-color: none;';
        document.getElementById('addPromo').style = 'background-color: rgba(27, 82, 151, 1); color: white;';
        component.set("v.sideTabsetOption", 'addProm');
    },
    manageAddPricebook: function(component){
        document.getElementById('currentPromo').style = 'background-color: none;';
        document.getElementById('addPromo').style = 'background-color: none;';
        document.getElementById('lastPromo').style = 'background-color: none;';
        document.getElementById('addPricebook').style = 'background-color: rgba(27, 82, 151, 1); color: white;';
        component.set("v.sideTabsetOption", 'addPricebook');
    },

})