/**
 * Created by Dawid Majdański on 04.02.2019.
 */
({
    getQueryObject: function(component){
      var queryObj = {
          "productType" : component.get("v.productType"),
          "searchText" : component.get('v.searchText'),
          "minPrice" : component.get("v.minPrice"),
          "maxPrice" : component.get("v.maxPrice"),
          "specificYear" : component.get("v.specificYear"),
          "minYear" : component.get("v.minYear"),
          "maxYear" : component.get("v.maxYear"),
          "author" : component.get("v.author"),
          "director" : component.get("v.director"),
          "bookGenre" : component.get("v.bookGenre"),
          "movieGenre" : component.get("v.movieGenre"),
          };
      sessionStorage.setItem('searchParams', JSON.stringify(queryObj));

      return queryObj;
    },
    getCurrentUser: function(component, event){
        if(!sessionStorage.getItem('user--info')){
            var action = component.get("c.getLoggedUser");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                   sessionStorage.setItem('user--info', JSON.stringify(response.getReturnValue()));
                }
            });
            $A.enqueueAction(action);
        }
    },
    advancedSearchModalAppearance: function(component, event){
        var isAdvSearchDisplayed = component.get("v.isAdvSearchDisplayed");
        if(isAdvSearchDisplayed){
            this.hideAdvancedSearchModal(component, event);
        }else{
            this.showAdvancedSearchModal(component, event);
        }
    },
    showAdvancedSearchModal: function(component, event){
        var modal = document.getElementById('advSearchModal');
        var arrowContainer = document.getElementById('arrowDiv');
        modal.classList.add('displayModal');
        modal.classList.remove('hideModal');
        arrowContainer.classList.add('rotate90ArrowContainer');
        arrowContainer.classList.remove('rotate0ArrowContainer');
        component.set("v.isAdvSearchDisplayed", true);
    },
    hideAdvancedSearchModal: function(component, event){
        var modal = document.getElementById('advSearchModal');
        var arrowContainer = document.getElementById('arrowDiv');
        modal.classList.add('hideModal');
        modal.classList.remove('displayModal');
        arrowContainer.classList.add('rotate0ArrowContainer');
        arrowContainer.classList.remove('rotate90ArrowContainer');
        component.set("v.isAdvSearchDisplayed", false);
    },
    handleToast: function(titleMessage, errorName, toastType){
        var toastParams = {
            title: titleMessage,
            message: errorName,
            type: toastType
        };
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
    checkIfMaxPriceLesserThanMin: function(component, event, helper){
        if(Math.floor(component.get("v.maxPrice"))<Math.floor(component.get("v.minPrice"))){
            this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Price_error'), "error");
            return false;
        }else{
            return true;
        }
    },
    checkIfMaxYearLesserThanMin: function(component, event, helper){
        if(component.get("v.maxYear")<component.get("v.minYear")){
            this.handleToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Years_error'), "error");
            return false;
        }else{
            return true;
        }
    },
    getCartItemsQuantity: function(component, event){
        if(localStorage.getItem('cartItems')){
            var cartItems = JSON.parse(localStorage.getItem('cartItems'));
            component.set("v.cartItemsQuantity", cartItems.length);
            this.getCartItems(component, event);
        }else{
            component.set("v.cartItemsQuantity", 0);
            component.set("v.cartProducts", []);
            component.set("v.totalCartPrice", 0);
        }
    },
    getTotalCartPrice: function(component, event){
        var cartProducts = component.get("v.cartProducts");
        var totalCartPrice = 0;
        for(var i=0; i<cartProducts.length; i++){
            totalCartPrice += this.calcTotalPrice(component, event, cartProducts[i], 'add');
        }
        component.set("v.totalCartPrice", totalCartPrice);
    },
    getCartItems: function(component, event){
        if(localStorage.getItem('cartItems')){
            var cartProducts = JSON.parse(localStorage.getItem('cartItems'));
            component.set("v.cartProducts", cartProducts);
            this.getTotalCartPrice(component, event);
        }
    },
    removeProductFromCart: function(component, event){
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        var cartProducts = component.get("v.cartProducts");
        var totalCartPrice = component.get("v.totalCartPrice");
        for(var i=0; i<cartProducts.length; i++){
            if(i == index){
                totalCartPrice += this.calcTotalPrice(component, event, cartProducts[i], 'subtract');
                cartProducts.splice(i, 1);
                break;
            }
        }
        component.set("v.cartProducts", cartProducts);
        component.set("v.totalCartPrice", totalCartPrice);
        component.set("v.cartItemsQuantity", cartProducts.length);
        localStorage.setItem('cartItems', JSON.stringify(cartProducts));
    },
    calcTotalPrice: function(component, event, cartProduct, operation){
        var totalCartPrice = 0;
        if(operation=='subtract'){
            if(cartProduct.discountPrice){
                totalCartPrice -= cartProduct.quantity * cartProduct.discountPrice;
            }else{
                totalCartPrice -= cartProduct.quantity * cartProduct.productPrice;
            }
        }else{
            if(operation=='add'){
                if(cartProduct.discountPrice){
                    totalCartPrice += cartProduct.quantity * cartProduct.discountPrice;
                }else{
                    totalCartPrice += cartProduct.quantity * cartProduct.productPrice;
                }
            }
        }
        return totalCartPrice;
    },

})