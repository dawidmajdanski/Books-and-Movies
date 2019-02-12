/**
 * Created by Majdan on 09.02.2019.
 */

public with sharing class BM_OrderController {
    @AuraEnabled
    public static Boolean createOrder(String productsToOrder, String shippingAddress){
        String newOrderId = prepareNewOrderObj(shippingAddress);
        List<OrderItem> orderItems = new List<OrderItem>();
        List<Object> productsResults = (List<Object>) JSON.deserializeUntyped(productsToOrder);
        for(Object o: productsResults){
            Map<String, Object> resultProduct = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(o));
            orderItems.add(new OrderItem(
                    Product2Id = String.valueOf(resultProduct.get('productId')),
                    Quantity = Integer.valueOf(resultProduct.get('quantity')),
                    UnitPrice = resultProduct.get('discountPrice')!=null?Decimal.valueOf(String.valueOf(resultProduct.get('discountPrice'))):Decimal.valueOf(String.valueOf(resultProduct.get('productPrice'))),
                    OrderId = newOrderId,
                    PricebookEntryId = String.valueOf(resultProduct.get('pricebookId'))
            ));
        }
        try{
            insert orderItems;
            return true;
        }catch (DmlException e){
            system.debug(e);
        }
        return false;
    }

    public static String prepareNewOrderObj(String shippingAddress){
        Map<String, Object> shippingAddressResult = (Map<String, Object>) JSON.deserializeUntyped(shippingAddress);
        Order newOrder = new Order();
        newOrder.AccountId = '0011t00000GDpwEAAT';
        newOrder.Status = 'Draft';
        newOrder.Pricebook2Id = '01s1t0000033ajsAAA';
        newOrder.EffectiveDate = Date.today();
        newOrder.ShippingCity = String.valueOf(shippingAddressResult.get('shippingCity'));
        newOrder.ShippingCountry = String.valueOf(shippingAddressResult.get('shippingCountry'));
        newOrder.ShippingState = String.valueOf(shippingAddressResult.get('shippingState'));
        newOrder.ShippingStreet = String.valueOf(shippingAddressResult.get('shippingStreet'));
        newOrder.ShippingPostalCode = String.valueOf(shippingAddressResult.get('shippingPostal'));
        insert newOrder;
        return newOrder.Id;
    }
}