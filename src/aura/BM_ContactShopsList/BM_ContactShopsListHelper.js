/**
 * Created by Dawid Majdański on 07.03.2019.
 */
({
    zoomMarkerOnMapAndHighlightRecord: function(component, event) {
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        var appEvent = $A.get("e.c:BM_LocationsRecordClickedEvent");
        if(appEvent){
            appEvent.setParams({"shopElement" : component.get("v.shopsResult")[index]});
            appEvent.fire();
            this.highlightRecord(component, index);
        }else {
            console.error('No such event: BM_LocationsRecordClickedEvent');
        }
    },
    highlightRecord: function(component, index){
        var shopsLst = component.get("v.shopsResult");
        for(var k=0; k < shopsLst.length; k++){
            var elem = document.getElementById(k);
            if(k!=index){
                elem.style.backgroundColor = 'transparent';
            }else{
                this.setBackgroundColor(elem);
            }
        }
    },
    setBackgroundColor: function(element){
         element.style.backgroundColor = '#e9ffe2';
    },
})