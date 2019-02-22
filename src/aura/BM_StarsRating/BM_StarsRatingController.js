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
        }
    },
    handleVoteBarToggleOver: function(component, event, helper){
        var element = document.getElementById("changeStarMouseOver");
        element.style.display="block";
        var left  = 35 + "px";
        var top  = -20 + "px";
        element.style.left = left;
        element.style.top = top;
    },
    handleVoteBarToggleLeave: function(component, event, helper){
        var element = document.getElementById("changeStarMouseOver");
        element.style.display="none";
    },
})