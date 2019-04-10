/**
 * Created by Dawid Majdański on 08.02.2019.
 */
({
    init: function(component, event, helper){
        if(localStorage.getItem('cartItems')){
            let cartProducts = JSON.parse(localStorage.getItem('cartItems'));
            component.set("v.cartProducts", cartProducts);
            helper.getTotalCartPrice(component, cartProducts);
        }
    },
    handleRemoveFromCart: function(component, event, helper){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;
        let totalCartPrice = component.get("v.totalCartPrice");
        let cachedProducts = localStorage.getItem('cartItems');
        let cartProducts = JSON.parse(cachedProducts);
        for(let i=0; i<cartProducts.length; i++){
            if(i == index){
                totalCartPrice -= cartProducts[i].quantity * cartProducts[i].price;
                cartProducts.splice(i, 1);
                break;
            }
        }
        component.set("v.totalCartPrice", totalCartPrice);
        component.set("v.cartProducts", cartProducts);
        localStorage.setItem('cartItems', JSON.stringify(cartProducts));
        if(cartProducts.length==0 || !cartProducts){
            sessionStorage.removeItem('user--shipping');
            sessionStorage.removeItem('itemsInCartAccepted');
            sessionStorage.removeItem('deliverySelectionDone');
            sessionStorage.removeItem('orderCompletedSuccessfully');
        }
        let updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
        if(updateQuantityEvt){
             updateQuantityEvt.fire();
        }else {
             component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), "Couldn't find: BM_ProductsCartQuantityEvent", 'error');
        }
    },
    handleQuantityChange: function(component, event, helper){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;
        let value = document.getElementById(index).value;

        if(helper.validateQuantityInput(value, index)!=false){
            let cachedProducts = localStorage.getItem('cartItems');
            let cartProducts = JSON.parse(cachedProducts);
            for(let i=0; i<cartProducts.length; i++){
                if(i == index){
                    cartProducts[index].quantity = value;
                    break;
                }
            }
            helper.getTotalCartPrice(component, cartProducts);
            component.set("v.cartProducts", cartProducts);
            localStorage.setItem('cartItems', JSON.stringify(cartProducts));
        }
    },
    handleGoToDeliveryPage: function(component, event){
        let user = JSON.parse(sessionStorage.getItem('user--info'));
        if(user.Id==$A.get('$Label.c.Guest_user')){
            component.find("toastMsg").showToast('', $A.get('$Label.c.User_not_logged_msg'), "info");
        }else{
            sessionStorage.setItem('itemsInCartAccepted', true);
            let navEvt = $A.get('e.force:navigateToURL');
            if(navEvt){
                navEvt.setParams({url: '/delivery'});
                navEvt.fire();
            }else{
                 component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Navigation_error'), 'error');
            }
        }
    },
    handleCartProductClick: function(component, event){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;
        for(let i=0; i<component.get("v.cartProducts").length; i++){
            if(index == i){
                 sessionStorage.setItem('customSearch--record', JSON.stringify(component.get("v.cartProducts")[i]));
                 let navEvt = $A.get('e.force:navigateToURL');
                 if(navEvt){
                     navEvt.setParams({url: '/details'});
                     navEvt.fire();
                 }else{
                     component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), $A.get('$Label.c.Navigation_error'), 'error');
                 }
                 break;
            }
        }
    },
})