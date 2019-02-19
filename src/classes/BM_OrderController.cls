/**
 * Created by Majdan on 09.02.2019.
 */

public with sharing class BM_OrderController {
    @AuraEnabled
    public static String createOrder(String productsToOrder, String shippingAddress) {
        String newOrderId = prepareNewOrderObj(shippingAddress);
        List<OrderItem> orderItems = new List<OrderItem>();
        List<Object> productsResults = (List<Object>) JSON.deserializeUntyped(productsToOrder);
        for (Object o : productsResults) {
            Map<String, Object> resultProduct = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(o));
            orderItems.add(new OrderItem(
                    Product2Id = String.valueOf(resultProduct.get('productId')),
                    Quantity = Integer.valueOf(resultProduct.get('quantity')),
                    UnitPrice = resultProduct.get('discountPrice') != null ? Decimal.valueOf(String.valueOf(resultProduct.get('discountPrice'))) : Decimal.valueOf(String.valueOf(resultProduct.get('productPrice'))),
                    OrderId = newOrderId,
                    PricebookEntryId = String.valueOf(resultProduct.get('pricebookEntryId'))
            ));
        }

        system.debug(orderItems.get(0).Product2Id + ' ' + orderItems.get(0).Quantity + ' ' + orderItems.get(0).UnitPrice + ' ' + orderItems.get(0).OrderId + ' ' + orderItems.get(0).PricebookEntryId);

        try {
            insert orderItems;
            return [SELECT Id, OrderNumber FROM ORDER WHERE Id = :newOrderId].get(0).OrderNumber;
        } catch (DmlException e) {
            system.debug(e);
        }
        return null;
    }

    @AuraEnabled
    public static List<Order> getMyOrders() {
        List<Order> orders = [
                SELECT Id, Status, CreatedBy.Name, TotalAmount, Name, OrderNumber, EffectiveDate, (SELECT PricebookEntry.Pricebook2Id, Quantity, PricebookEntry.Name, Product2.Name, UnitPrice from OrderItems)
                FROM ORDER
                WHERE CreatedBy.Id = :UserInfo.getUserId() ORDER BY OrderNumber Desc
        ];
        return orders;
    }

    public static String prepareNewOrderObj(String shippingAddress) {
        Map<String, Object> shippingAddressResult = (Map<String, Object>) JSON.deserializeUntyped(shippingAddress);
        Order newOrder = new Order();
        newOrder.AccountId = System.Label.Registrants_account_id;
        newOrder.Status = System.Label.New_order_initial_status;
        newOrder.Pricebook2Id = System.Label.New_order_pricebook_id;
        newOrder.EffectiveDate = Date.today();
        newOrder.ShippingCity = String.valueOf(shippingAddressResult.get('shippingCity'));
        newOrder.ShippingCountry = String.valueOf(shippingAddressResult.get('shippingCountry'));
        newOrder.ShippingState = String.valueOf(shippingAddressResult.get('shippingState'));
        newOrder.ShippingStreet = String.valueOf(shippingAddressResult.get('shippingStreet'));
        newOrder.ShippingPostalCode = String.valueOf(shippingAddressResult.get('shippingPostal'));
        insert newOrder;
        return newOrder.Id;
    }

    public static User getCurrentUser() {
        return [SELECT Id, Name, Email FROM User WHERE Id = :UserInfo.getUserId()];
    }

    @AuraEnabled
    public static Map<String, Object> getPricebookEntryProduct(String orderItemName) {
        List<PricebookEntry> priceBookEntryItem = [
                SELECT Discount_percentage__c, Product2.RecordType.Name, Product2.Release_date__c, Product2.Director__c, Product2.Book_author__c, Product2.Description, Pricebook2.Name, Pricebook2.Id, Product2.Name, UnitPrice, ProductCode
                FROM PricebookEntry
                WHERE Product2.Name =: orderItemName
        ];
        List<String> productIds = BM_ProductUtils.getIds(priceBookEntryItem);
        List<Attachment> mainPics = BM_ProductUtils.getMainPictures(productIds);
        List<AggregateResult> productsRating = BM_ProductUtils.getRatingForProducts(productIds);
        for(Integer i=0; i<priceBookEntryItem.size(); i++){
            if (priceBookEntryItem.get(i).Pricebook2.Name == System.Label.Standard_pricebook_name) {
                Map<String, Object> jsonItem = BM_ProductUtils.getParsedJSON(priceBookEntryItem.get(i), productsRating, mainPics);
                for(Integer j=0; j<priceBookEntryItem.size(); j++){
                    if (priceBookEntryItem.get(j).Pricebook2.Name == System.Label.Regular_discount_pricebook_name) {
                        jsonItem.put('discountPrice', priceBookEntryItem.get(j).UnitPrice);
                        jsonItem.put('discountPercentage', priceBookEntryItem.get(j).Discount_percentage__c);
                    }
                }
                return jsonItem;
            }
        }
        return null;
    }

}