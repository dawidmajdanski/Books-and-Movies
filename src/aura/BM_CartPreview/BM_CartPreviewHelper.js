/**
 * Created by Dawid Majdański on 21.02.2019.
 */
({
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