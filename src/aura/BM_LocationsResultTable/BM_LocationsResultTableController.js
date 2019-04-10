/**
 * Created by Dawid Majdański on 21.12.2018.
 */
({
    handleReceiveShopsList : function(component, event, helper){
        var shops = event.getParam("shopsResultList");
        component.set("v.shopsResult", shops);

        var shopsResult = component.get("v.shopsResult");
        if(shopsResult && shopsResult.length!=0){
            component.set("v.isVisible", true);
        }else{
            component.set("v.isVisible", false);
        }
    },
    handleRecordSaved: function(component, event, helper){
        var item = event.getParam("changedShop");
        var shops = component.get("v.shopsResult");
        var shopIndex = component.get("v.shopIndexToHighlight");
        for(var i=0; i < shops.length; i++){
            if(shops[i].Id == item.Id){
                shops[i] = item;
            }
        }
        component.set("v.shopsResult", shops);
        setTimeout(function(){
            var elem = document.getElementById(shopIndex);
            helper.setBackgroundColor(elem);
        },1);
    },
    handleRecordDeleted: function(component, event, helper){
        var shops = component.get("v.shopsResult");
        var shopToDel = event.getParam("shopToClear");

        for(var i=0; i<shops.length; i++){
            if(shops[i].Id == shopToDel.Id){
                shops.splice(i,1);
            }
        }
        component.set("v.shopsResult",shops);
    },
    onZoomMarkerOnMapAndHighlightRecord: function(component, event, helper){
        helper.zoomMarkerOnMapAndHighlightRecord(component, event);
    },
})