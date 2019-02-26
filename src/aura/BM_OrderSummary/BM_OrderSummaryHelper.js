/**
 * Created by Majdan on 10.02.2019.
 */
({
  clearCart: function(component, event){
      localStorage.removeItem('cartItems');
      let updateQuantityEvt = $A.get("e.c:BM_ProductsCartQuantityEvent");
      if(updateQuantityEvt){
           updateQuantityEvt.fire();
      }else {
           console.error('No such event: BM_ProductsCartQuantityEvent');
      }
  },
})