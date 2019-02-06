({
    afterScriptsLoaded : function(component, event, helper) {
        var domEl = component.find("ratingarea").getElement();
        var currentRating = component.get('v.value');
        var readOnly = component.get('v.readonly');
        var maxRating = 5;
        var callback = function(rating) {
            component.set('v.value',rating);
        }
        component.ratingObj = rating(domEl,currentRating,maxRating,callback,readOnly);
    },
    onValueChange: function(component,event,helper) {
        if (component.ratingObj) {
             var value = component.get('v.value');
             component.ratingObj.setRating(value,false);

//             var movieSerialized = JSON.stringify(component.get("v.movie"));
//             var action = component.get("c.setRating");
//             action.setParams({ratingVal : value, movieObj : movieSerialized});
//             action.setCallback(this, function(response) {
//                 var state = response.getState();
//                 if (state === "SUCCESS") {
//                     var obj = response.getReturnValue();
//                     if(obj != null){
//                        component.set("v.value", value);
//                     }
//                 } else {
//                     var errors = response.getError();
//                     if (errors) {
//                         if (errors[0] && errors[0].message) {
//                             console.error("Error message: " +
//                                      errors[0].message);
//                         }
//                     } else {
//                         console.error("Unknown error");
//                     }
//                 }
//             });
//             $A.enqueueAction(action);
        }
    },
    handleVoteBarToggleOver: function(component, event, helper){
        var element = document.getElementById("changeStarMouseOver");
        element.style.display="block";

        var left  = 35 + "px";
        var top  = -22 + "px";
        element.style.left = left;
        element.style.top = top;
    },
    handleVoteBarToggleLeave: function(component, event, helper){
        var element = document.getElementById("changeStarMouseOver");
        element.style.display="none";
    },
})