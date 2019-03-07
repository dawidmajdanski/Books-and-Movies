/**
 * Created by Majdan on 03.02.2019.
 */
({
    init: function(component, event, helper) {
        if(!helper.getProductById(component)){
            helper.getPicturesForProduct(component);
        }
    },
    sortPictures: function(component){
        let pics = component.get("v.pictures");
        let temp;
        for(let i=0; i<pics.length; i++){
            if(pics[i].pictureName.includes($A.get('$Label.c.Main_picture_name'))){
                temp=pics[0];
                pics[0]=pics[i];
                pics[i]=temp;
                break;
            }
        }
        component.set("v.pictures", pics);
    },
    handleAddToCart: function(component, event, helper){
        if(helper.validateQuantity(component)!=false){
            let cartItem = component.get('v.product');
            let addToCartEvt = $A.get("e.c:BM_AddToCartEvent");
            if(addToCartEvt){
                addToCartEvt.setParams({"productToCart" : cartItem, "quantity": component.get("v.quantity")});
                addToCartEvt.fire();
            }else {
                console.error('No such event: BM_AddToCartEvent');
            }
        }
    },

})