/**
 * Created by Majdan on 10.02.2019.
 */
({
  initPageVisibility: function(component){
      if(sessionStorage.getItem('deliverySelectionDone')){
          component.set("v.showPage", true);
          component.set("v.shippingAddress", JSON.parse(sessionStorage.getItem('user--shipping')));
          this.getTotalOrderPrice(component);
      }else{
          component.set("v.showPage", false);
          let navEvt = $A.get('e.force:navigateToURL');
          if(navEvt){
              navEvt.setParams({url: '/'});
              navEvt.fire();
          }
      }
  },
  getTotalOrderPrice: function(component){
      component.set("v.productsToOrder", JSON.parse(localStorage.getItem('cartItems')));
      let productsToOrder = component.get("v.productsToOrder");
      let totalOrderPrice = 0;
      for(let i=0; i<productsToOrder.length; i++){
          totalOrderPrice += productsToOrder[i].price * productsToOrder[i].quantity;
      }
      component.set("v.totalOrderPrice", totalOrderPrice);
  },
  clearCart: function(){
      localStorage.removeItem('cartItems');
      let updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
      if(updateQuantityEvt){
           updateQuantityEvt.fire();
      }else {
           console.error('No such event: BM_ProductsCartQuantityEvent');
      }
  },
})