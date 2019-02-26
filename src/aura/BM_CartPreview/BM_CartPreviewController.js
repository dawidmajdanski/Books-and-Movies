/**
 * Created by Dawid Majdański on 21.02.2019.
 */
({
    init: function(component, event, helper){
        helper.getCartItemsQuantity(component, event);
    },
    handleProductsInCart: function(component, event, helper){
        $A.enqueueAction(component.get('c.handleCartRollUp'));
        let navEvt = $A.get('e.force:navigateToURL');
        if(navEvt){
            navEvt.setParams({url: '/cart'});
            navEvt.fire();
        }
    },
    handleUpdateCartProductsQuantity: function(component, event, helper){
        helper.getCartItemsQuantity(component, event);
    },
    handleCartRollDown: function(component, event, helper){
        helper.getCartItems(component, event);
        document.getElementById('cart').style = 'width: 298px; background-color: rgb(90, 91, 93)';
        setTimeout(function(){
            document.getElementById('cartItemsTotalPrice').style = 'width: auto';
        }, 100);
        setTimeout(function(){
            document.getElementById('cartPreview').style = 'height: 409px;';
        }, 350);
    },
    handleCartRollUp: function(component, event, helper){
        document.getElementById('cartPreview').style = 'height: 0';
        setTimeout(function(){
             document.getElementById('cartItemsTotalPrice').style = 'width: 0';
             document.getElementById('cart').style = 'width: 5%; background-color: none';
        }, 350);
    },
    handleRemoveProductFromCart: function(component, event, helper){
        helper.removeProductFromCart(component, event);
    },
    handleAddProductToCart: function(component, event, helper){
       let cartItem = event.getParam("productToCart");
       let quantity = event.getParam("quantity");
       let parsedCartItemsToAdd = [];
       cartItem.quantity = quantity;
       if(localStorage.getItem('cartItems')){
           let cartItems = localStorage.getItem('cartItems');
           let parsedCartItems = JSON.parse(cartItems);
           for(let i=0; i<parsedCartItems.length; i++){
               parsedCartItemsToAdd.push(parsedCartItems[i]);
           }
           localStorage.removeItem('cartItems');
       }
       parsedCartItemsToAdd.push(cartItem);
       localStorage.setItem('cartItems', JSON.stringify(parsedCartItemsToAdd));

       let updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
       if(updateQuantityEvt){
            updateQuantityEvt.fire();
       }else {
            component.find("toastMsg").showToast($A.get('$Label.c.Error_toast_title'), "Internal error. No such event: BM_ProductsCartQuantityEvent", 'error');
       }
    },
})