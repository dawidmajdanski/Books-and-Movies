/**
 * Created by Majdan on 09.02.2019.
 */

public without sharing class BM_OrderController {
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
                    UnitPrice = Decimal.valueOf(String.valueOf(resultProduct.get('price'))),
                    OrderId = newOrderId,
                    PricebookEntryId = String.valueOf(resultProduct.get('pricebookEntryId'))
            ));
        }

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
                SELECT Id, Status, CreatedBy.Name, TotalAmount, Name, OrderNumber, EffectiveDate, (SELECT PricebookEntry.Standard_price__c, PricebookEntry.Pricebook2Id, Quantity, PricebookEntry.Name, Product2.Name, Product2.ProductCode, UnitPrice from OrderItems)
                FROM ORDER
                WHERE CreatedBy.Id = :UserInfo.getUserId()
                ORDER BY OrderNumber Desc
        ];
        return orders;
    }

    public static String prepareNewOrderObj(String shippingAddress) {
        Map<String, Object> shippingAddressResult = (Map<String, Object>) JSON.deserializeUntyped(shippingAddress);
        Order newOrder = new Order();
        newOrder.AccountId = System.Label.Registrants_account_id;
        newOrder.Status = System.Label.New_order_initial_status;
        newOrder.Pricebook2Id = System.Label.Standard_Pricebook_Id;
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
        return [SELECT Id, Name, Email, ContactId FROM User WHERE Id = :UserInfo.getUserId()];
    }

    @AuraEnabled
    public static List<Object> getPricebookEntryProduct(String orderItemName) {
        List<Product2> productItem = [
                SELECT (SELECT User__c, Product__c FROM Favourite_products__r WHERE User__c =: UserInfo.getUserId()), (SELECT Discount_percentage__c, Pricebook2.Name, Pricebook2.Id, UnitPrice, ProductCode, Name, Standard_price__c FROM PricebookEntries where IsActive=true AND Pricebook2.Ongoing_promotion__c = true), RecordType.Name, Release_date__c, Director__c, Book_author__c, Description, Name
                FROM Product2
                WHERE Name =: orderItemName
        ];

        return BM_ProductUtils.parseObj(productItem);
    }

    @AuraEnabled
    public static Boolean submitNewComplaint(Order orderObj, OrderItem orderItemObj, User person, String caseSubject, String caseDescription){
        Case newCase = new Case();
        newCase.Status = 'New';
        newCase.Priority = 'Medium';
        newCase.Origin = 'Web';
        newCase.Subject = caseSubject;
        newCase.Description = caseDescription;
        newCase.Order__c = orderObj.Id;
        newCase.Order_product__c = orderItemObj.Id;
        newCase.ContactId = person.ContactId;

        try{
            insert newCase;
            return true;
        }catch (DmlException e){
            system.debug(e);
        }
        return false;
    }

    @AuraEnabled
    public static String getMyComplaints(){
        List<Case> userCases = [
                SELECT Id, ContactId, Order__c,
                        Order_Product__c, Order__r.OrderNumber, Order__r.CreatedDate, Order_Product__r.Product2.Name,
                        CaseNumber, Status, Reason, CreatedDate, Order_Product__r.UnitPrice,
                        Subject, Description, ClosedDate,
                        (SELECT NewValue, OldValue, CreatedDate from Histories where Field='Status' ORDER BY CreatedDate DESC ),
                        (SELECT id, textbody, CreatedBy.Name, CreatedDate from emailmessages)
                FROM Case WHERE ContactId =: [SELECT ContactId FROM User WHERE Id =: UserInfo.getUserId()].get(0).ContactId ORDER BY Status DESC,CreatedDate];

        return userCases.size()!=0?JSON.serialize(userCases):null;
    }

    @AuraEnabled
    public static List<String> getCaseReasonValues(){
        Schema.DescribeFieldResult F = Case.Reason.getDescribe();
        Schema.sObjectField T = F.getSObjectField();
        return getGlobalPicklistValues(T);
    }

    private static List<String> getGlobalPicklistValues(Schema.sObjectField objField){
        List<PicklistEntry> entries = objField.getDescribe().getPicklistValues();
        List<String> results = new List<String>();
        for(PicklistEntry entry: entries){
            results.add(entry.getLabel());
        }
        return results;
    }

}