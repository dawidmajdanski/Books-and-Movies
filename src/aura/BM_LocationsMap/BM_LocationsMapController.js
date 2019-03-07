/**
 * Created by Dawid Majdański on 21.12.2018.
 */
({
    init : function(component, event, helper) {
    var map = L.map('map', {zoomControl: true})
                  .setView([0, 0], 2);
      L.tileLayer(
       'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
       {
         attribution: 'Tiles © Esri'
       }).addTo(map);
      component.set("v.map", map);

    },
    handleReceiveShopsList : function(component, event, helper){
        var shops = event.getParam("shopsResultList");
        var map = component.get('v.map');
        var markersAttr = component.get("v.markers");
        var markersList = [];

        map.setView([0, 0], 2);
        if(markersAttr!=null){
           for(var i=0;i<markersAttr.length;i++) {
               map.removeLayer(markersAttr[i]);
           }
        }

        for (var i=0; i<shops.length; i++) {
            var shop = shops[i];
            var latLng = [shop.BillingLatitude, shop.BillingLongitude];
            var geolocation = new L.marker(latLng).bindPopup(shop.BillingStreet+", Phone: "+shop.Phone);

            markersList.push(geolocation);
            map.addLayer(markersList[i]);
        }
        component.set("v.markers",markersList);
    },
    handleRecordClicked: function(component, event, helper){
        var item = event.getParam("shopElement");
        var map = component.get("v.map");
        component.set("v.shopCurrentLocation", item);
        map.setView([item.BillingLatitude, item.BillingLongitude],14);
    },
    handleRecordSaved: function(component, event, helper){
        var item = event.getParam("changedShop");
        var shopCurrentLocation = component.get("v.shopCurrentLocation");
        var map = component.get("v.map");
        var markersAttr = component.get("v.markers");
        var newCoords = [item.BillingLatitude, item.BillingLongitude];

        for(var i=0; i<markersAttr.length; i++){
            var markerToStr = JSON.parse(JSON.stringify(markersAttr[i].getLatLng()));
            if(markerToStr.lat == shopCurrentLocation.BillingLatitude && markerToStr.lng == shopCurrentLocation.BillingLongitude){
               markersAttr[i].setLatLng(newCoords);
               markersAttr[i].bindPopup(item.Name+", "+item.BillingCity+", "+item.BillingStreet);
            }
        }

        component.set("v.shopCurrentLocation", item);
        component.set("v.map",map);
        component.set("v.markers",markersAttr);
        map.setView([item.BillingLatitude, item.BillingLongitude],14);
    },
    handleRecordDeleted: function(component, event, helper){
        var shopToDel = event.getParam("shopToClear");
        var markersAttr = component.get("v.markers");
        var map = component.get("v.map");
        for(var i=0; i<markersAttr.length; i++){
            var markerToStr = JSON.parse(JSON.stringify(markersAttr[i].getLatLng()));
            if(markerToStr.lat == shopToDel.BillingLatitude && markerToStr.lng == shopToDel.BillingLongitude){
               map.removeLayer(markersAttr[i]);
               markersAttr.splice(i, 1);
            }
        }
        component.set("v.map",map);
        component.set("v.markers",markersAttr);
    },
})