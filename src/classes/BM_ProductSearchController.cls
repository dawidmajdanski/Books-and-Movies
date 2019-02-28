/**
 * Created by Dawid Majdański on 31.01.2019.
 */

public class BM_ProductSearchController {
    @AuraEnabled
    public static List<Object> searchForProducts(String searchObj) {
        return BM_ProductUtils.searchAction(searchObj);
    }

    @AuraEnabled
    public static List<Object> getPopularProducts(){
        List<AggregateResult> avgPopular = [SELECT AVG(Rating__c) averageRating, Product__c pId from Product_rating__c group by Product__c HAVING Avg(Rating__c)>4.5];
        List<String> ids = new List<String>();
        for(AggregateResult ar: avgPopular){
            ids.add(String.valueOf(ar.get('pId')));
        }
        List<Product2> popularProducts = [SELECT (SELECT User__c, Product__c FROM Favourite_products__r WHERE User__c =: UserInfo.getUserId()) ,(SELECT Discount_percentage__c, Pricebook2.Name, Pricebook2.Id, UnitPrice, ProductCode, Standard_price__c FROM PricebookEntries WHERE IsActive=true AND Pricebook2.Ongoing_promotion__c=true), RecordType.Name, Release_date__c, Director__c, Book_author__c, Description, Name From Product2 WHERE Id in :(ids)];
        return BM_ProductUtils.parseObj(popularProducts);
    }

    @AuraEnabled
    public static List<Object> getPicturesForSingleProduct(String productId){
        String query = 'Select ParentId, Id, Name FROM Attachment WHERE ParentId = \''+productId+'\'';
        List<Attachment> results = Database.query(query);

        List<Object> serializedPics = new List<Object>();
        for(Integer i=0; i<results.size(); i++) {
            Map<String, Object> jsonItem = new Map<String, Object>();
            jsonItem.put('pictureName', results.get(i).Name);
            jsonItem.put('pictureURL', System.Label.Picture_url_prefix+results.get(i).Id);
            serializedPics.add(jsonItem);
        }
        return serializedPics;
    }

    @AuraEnabled
    public static List<Product_rating__c> getReviewsForSingleProduct(String productId){
        String query = 'Select Rating__c, Review__c, User__c, User__r.SmallPhotoUrl, CreatedDate, User__r.Name, Product__c, Id, Name FROM Product_rating__c WHERE Product__c = \''+productId+'\' ORDER BY CreatedDate Desc';
        return Database.query(query);
    }

    @AuraEnabled
    public static Map<String, Object> getRatingForSingleProduct(String productId){
        List<AggregateResult> productRating = [SELECT COUNT(Rating__c) countRating, AVG(Rating__c) averageRating, Product__c pId FROM Product_rating__c WHERE Product__c = :productId group by Product__c];

        Map<String, Object> jsonItem = new Map<String, Object>();
        jsonItem.put('averageRating', productRating.size()!=0?productRating.get(0).get('averageRating'):0);
        jsonItem.put('countRating', productRating.size()!=0?productRating.get(0).get('countRating'):0);
        return jsonItem;
    }

    @AuraEnabled
    public static List<String> getMovieGenresEntries(){
        Schema.DescribeFieldResult F = Product2.Movie_genres__c.getDescribe();
        Schema.sObjectField T = F.getSObjectField();
        return getGlobalPicklistValues(T);
    }

    @AuraEnabled
    public static List<String> getBookGenresEntries(){
        Schema.DescribeFieldResult F = Product2.Book_genres__c.getDescribe();
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

    @AuraEnabled
    public static Product_rating__c getUserRatingForProduct(String productId){
        String user = UserInfo.getUserId();
        List<Product_rating__c> productRating = [SELECT Id, Review__c, Rating__c, Product__c, User__c, CreatedDate FROM Product_rating__c WHERE Product__c =: productId AND User__c =: user];
        if(productRating.size()!=0){
            return productRating.get(0);
        }
        return null;
    }

    @AuraEnabled
    public static Product_rating__c saveReviewForProduct(String newComment,Integer newVote, String productId, String userId){
        Product_rating__c productRating = new Product_rating__c();
        productRating.Product__c = productId;
        productRating.User__c = userId;
        productRating.Review__c = newComment;
        productRating.Rating__c = newVote;
        try{
            insert productRating;
            return [SELECT Rating__c, Review__c, User__c, User__r.SmallPhotoUrl, CreatedDate, User__r.Name, Product__c, Id, Name FROM Product_rating__c where Product__c =: productId AND User__c =: userId];
        }catch(DmlException e){
            system.debug(e);
        }
        return null;
    }

    @AuraEnabled
    public static void deleteProductReview(String productId, String userId){
        List<Product_rating__c> productReview = [SELECT Id FROM Product_rating__c WHERE Product__c =: productId AND User__c =: userId];
        try{
            delete productReview;
        }catch(DmlException e){
            system.debug(e);
        }
    }

    @AuraEnabled
    public static Product_rating__c updateReviewForProduct(String reviewId, String newComment, Integer newVote){
        List<Product_rating__c> productRating = [SELECT Rating__c, Review__c, User__c, User__r.SmallPhotoUrl, CreatedDate, User__r.Name, Product__c, Id, Name FROM Product_rating__c where Id =: reviewId];
        productRating.get(0).Review__c = newComment;
        productRating.get(0).Rating__c = newVote;

        try{
            update productRating;
            return productRating.get(0);
        }catch(DmlException e){
            system.debug(e);
        }
        return null;
    }

    @AuraEnabled
    public static User getLoggedUser(){
        return [SELECT id, name, country, city, postalcode, street, state, email FROM USER WHERE Id =: UserInfo.getUserId()];
    }

}