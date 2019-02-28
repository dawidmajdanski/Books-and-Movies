/**
 * Created by Dawid Majdański on 26.02.2019.
 */
({
    addToFavourites: function(component, event, helper){
        let action = component.get('c.addProductToFavourites');
        helper.manageUserFavouriteProduct(component, action, 'Added to favourites', true);
    },
    removeFromFavourites: function(component, event, helper){
        let action = component.get('c.removeProductFromFavourites');
        helper.manageUserFavouriteProduct(component, action, 'Removed from favourites', false);
    },

})