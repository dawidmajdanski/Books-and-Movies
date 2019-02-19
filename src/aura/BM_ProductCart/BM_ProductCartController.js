/**
 * Created by Dawid Majdański on 08.02.2019.
 */
({
    init: function(component, event, helper){
        if(localStorage.getItem('cartItems')){
            var cartProducts = JSON.parse(localStorage.getItem('cartItems'));
            component.set("v.cartProducts", cartProducts);
            helper.getTotalCartPrice(component, event, cartProducts);
        }
        helper.getUser(component, event);
    },
    handleRemoveFromCart: function(component, event, helper){
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        var totalCartPrice = component.get("v.totalCartPrice");
        var cachedProducts = localStorage.getItem('cartItems');
        var cartProducts = JSON.parse(cachedProducts);
        for(var i=0; i<cartProducts.length; i++){
            if(i == index){
                if(cartProducts[i].discountPrice){
                    totalCartPrice -= cartProducts[i].quantity * cartProducts[i].discountPrice;
                }else{
                    totalCartPrice -= cartProducts[i].quantity * cartProducts[i].productPrice;
                }
                cartProducts.splice(i, 1);
                break;
            }
        }
        component.set("v.totalCartPrice", totalCartPrice);
        component.set("v.cartProducts", cartProducts);
        localStorage.setItem('cartItems', JSON.stringify(cartProducts));
        if(cartProducts.length==0 || !cartProducts){
            sessionStorage.removeItem('user--shipping');
            sessionStorage.removeItem('user--info');
            sessionStorage.removeItem('itemsInCartAccepted');
            sessionStorage.removeItem('deliverySelectionDone');
            sessionStorage.removeItem('orderCompletedSuccessfully');
        }
        var updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
        if(updateQuantityEvt){
             updateQuantityEvt.fire();
        }else {
             console.error('No such event: BM_ProductsCartQuantityEvent');
        }
    },
    handleQuantityChange: function(component, event, helper){
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        var value = document.getElementById(index).value;

        if(helper.validateQuantityInput(value, index)!=false){
            var cachedProducts = localStorage.getItem('cartItems');
            var cartProducts = JSON.parse(cachedProducts);
            for(var i=0; i<cartProducts.length; i++){
                if(i == index){
                    cartProducts[index].quantity = value;
                    break;
                }
            }
            helper.getTotalCartPrice(component, event, cartProducts);
            component.set("v.cartProducts", cartProducts);
            localStorage.setItem('cartItems', JSON.stringify(cartProducts));
        }
    },
    handleGoToDeliveryPage: function(component, event, helper){
        if(component.get("v.user").Id==$A.get('$Label.c.Guest_user')){
            helper.handleToast("", $A.get('$Label.c.User_not_logged_msg'), "info");
        }else{
            sessionStorage.setItem('user--info', JSON.stringify(component.get("v.user")));
            sessionStorage.setItem('itemsInCartAccepted', true);
            var navEvt = $A.get('e.force:navigateToURL');
            navEvt.setParams({url: '/delivery'});
            navEvt.fire();
        }
    },
    handleCartProductClick: function(component, event, helper){
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        for(var i=0; i<component.get("v.cartProducts").length; i++){
            if(index == i){
                 sessionStorage.setItem('customSearch--record', JSON.stringify(component.get("v.cartProducts")[i]));
                 var navEvt = $A.get('e.force:navigateToURL');
                 navEvt.setParams({url: '/details'});
                 navEvt.fire();
                 break;
            }
        }
    },

})