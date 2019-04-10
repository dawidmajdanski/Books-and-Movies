/**
 * Created by Dawid Majdański on 07.03.2019.
 */
({
    handleReceiveShopsList : function(component, event, helper){
        let shops = event.getParam("shopsResultList");
        component.set("v.shopsResult", shops);
    },
    onZoomMarkerOnMapAndHighlightRecord: function(component, event, helper){
        helper.zoomMarkerOnMapAndHighlightRecord(component, event);
    },
})