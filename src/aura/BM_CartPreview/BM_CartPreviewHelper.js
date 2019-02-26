/**
 * Created by Dawid Majdański on 21.02.2019.
 */
({
    getCartItemsQuantity: function(component, event){
        if(localStorage.getItem('cartItems')){
            let cartItems = JSON.parse(localStorage.getItem('cartItems'));
            component.set("v.cartItemsQuantity", cartItems.length);
            this.getCartItems(component, event);
        }else{
            component.set("v.cartItemsQuantity", 0);
            component.set("v.cartProducts", []);
            component.set("v.totalCartPrice", 0);
        }
    },
    getTotalCartPrice: function(component, event){
        let cartProducts = component.get("v.cartProducts");
        let totalCartPrice = 0;
        for(let i=0; i<cartProducts.length; i++){
            totalCartPrice += this.calcTotalPrice(component, event, cartProducts[i], 'add');
        }
        component.set("v.totalCartPrice", totalCartPrice);
    },
    getCartItems: function(component, event){
        if(localStorage.getItem('cartItems')){
            let cartProducts = JSON.parse(localStorage.getItem('cartItems'));
            component.set("v.cartProducts", cartProducts);
            this.getTotalCartPrice(component, event);
        }
    },
    removeProductFromCart: function(component, event){
        let selectedSection = event.currentTarget;
        let index = selectedSection.dataset.index;
        let cartProducts = component.get("v.cartProducts");
        let totalCartPrice = component.get("v.totalCartPrice");
        for(let i=0; i<cartProducts.length; i++){
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
        let totalCartPrice = 0;
        if(operation=='subtract'){
            totalCartPrice -= cartProduct.quantity * cartProduct.price;
        }else{
            if(operation=='add'){
                totalCartPrice += cartProduct.quantity * cartProduct.price;
            }
        }
        return totalCartPrice;
    },
})