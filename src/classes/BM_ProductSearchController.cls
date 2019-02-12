/**
 * Created by Dawid Majdański on 31.01.2019.
 */

public class BM_ProductSearchController {
    @AuraEnabled
    public static List<Object> searchForProducts(String searchObj) {
        List<String> queryParams = BM_SearchUtils.parseQuery(searchObj);
        String searchquery = 'Select Product2.Release_date__c, Product2.Director__c, Product2.Book_author__c, Product2.Description, Pricebook2.Name, Pricebook2.Id, Product2.Name, UnitPrice, ProductCode From PricebookEntry WHERE ';

        for(String param: queryParams){
            searchquery += param;
        }

        List<PricebookEntry> results = new List<PricebookEntry>();
        if(!queryParams.isEmpty()){
            results = Database.query(searchquery);
        }

        return parseObj(results);
    }

    @AuraEnabled
    public static List<Object> getPopularProducts(){
        List<AggregateResult> avgPopular = [SELECT AVG(Rating__c) averageRating, Product__c pId from Product_rating__c group by Product__c HAVING Avg(Rating__c)>4.5];
        List<String> ids = new List<String>();
        for(AggregateResult ar: avgPopular){
            ids.add(String.valueOf(ar.get('pId')));
        }
        List<PricebookEntry> popularProducts = [Select Product2.Release_date__c, Product2.Director__c, Product2.Book_author__c, Product2.Description, Pricebook2.Name, Pricebook2.Id, Product2.Name, UnitPrice, ProductCode From PricebookEntry WHERE Product2.Id in :(ids)];
        return parseObj(popularProducts);
    }

    public static Map<String, Object> getProductRatingIdForProduct(List<AggregateResult> ratings, String productId){
        Map<String, Object> result = new Map<String, Object>();
        for(AggregateResult ar: ratings){
            if(ar.get('productID')==productId){
                result.put('averageRating', ar.get('averageRating'));
                result.put('countRating', ar.get('countRating'));
                return result;
            }
        }
        return null;
    }

    public static String findAttachmentIdForResult(List<Attachment> attList, PricebookEntry resultItem){
        for(Attachment a: attList){
            if(a.ParentId==resultItem.Product2.Id){
                return 'https://booksandmovies-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file='+a.Id;
            }
        }
        return 'https://booksandmovies-dev-ed--c.visualforce.com'+PageReference.forResource('ProductPlaceholder').getUrl();
    }

    public static List<String> getIds(List<PricebookEntry> objectList){
        List<String> ids = new List<String>();
        for(PricebookEntry entry: objectList){
            ids.add(entry.Product2.Id);
        }
        return ids;
    }

    public static List<Attachment> getMainPictures(List<String> productIds){
        if(productIds.size()!=0){
            String query = 'Select ParentId, Id, Name FROM Attachment WHERE Name like \'%Main%\' AND (';
            for(Integer i=0; i<productIds.size(); i++){
                query +='ParentId=\''+productIds.get(i)+'\'';
                if(i!=productIds.size()-1){
                    query +=' OR ';
                }
            }
            query += ')';
            system.debug(query);
            return Database.query(query);
        }
        return null;
    }

    @AuraEnabled
    public static List<Object> getPicturesForSingleProduct(String productId){
        String query = 'Select ParentId, Id, Name FROM Attachment WHERE ParentId = \''+productId+'\'';
        List<Attachment> results = Database.query(query);

        List<Object> serializedPics = new List<Object>();
        for(Integer i=0; i<results.size(); i++) {
            Map<String, Object> jsonItem = new Map<String, Object>();
            jsonItem.put('pictureName', results.get(i).Name);
            jsonItem.put('pictureURL', 'https://booksandmovies-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file='+results.get(i).Id);
            serializedPics.add(jsonItem);
        }
        return serializedPics;
    }

    @AuraEnabled
    public static List<Product_rating__c> getReviewsForSingleProduct(String productId){
        String query = 'Select Rating__c, Review__c, User__c, User__r.SmallPhotoUrl, CreatedDate, User__r.Name, Product__c, Id, Name FROM Product_rating__c WHERE Product__c = \''+productId+'\'';
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
    public static List<AggregateResult> getRatingForProducts(List<String> productIds){
        if(productIds.size()!=0){
            List<AggregateResult> productRating = [SELECT COUNT(Rating__c) countRating, AVG(Rating__c) averageRating, Product__c productID FROM Product_rating__c group by Product__c HAVING Product__c in :(productIds) ];
            return productRating;
        }
        return null;
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
    public static User getLoggedUser(){
        return [SELECT id, name, country, city, postalcode, street, state, email FROM USER WHERE Id =: UserInfo.getUserId()];
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
        system.debug(reviewId);
        system.debug(newComment);
        system.debug(newVote);

        List<Product_rating__c> productrating = [SELECT Rating__c, Review__c, User__c, User__r.SmallPhotoUrl, CreatedDate, User__r.Name, Product__c, Id, Name FROM Product_rating__c where Id =: reviewId];
        productrating.get(0).Review__c = newComment;
        productrating.get(0).Rating__c = newVote;

        try{
            update productrating;
            return productrating.get(0);
        }catch(DmlException e){
            system.debug(e);
        }
        return null;
    }

    public static List<Object> parseObj(List<PricebookEntry> pricebookEntryList){
        List<String> productIds = getIds(pricebookEntryList);
        List<Attachment> mainPics = getMainPictures(productIds);
        List<AggregateResult> productsRating = getRatingForProducts(productIds);

        List<Object> serializedProducts = new List<Object>();
        for(Integer i=0; i<pricebookEntryList.size(); i++){
            Map<String, Object> jsonItem = new Map<String, Object>();
            if(pricebookEntryList.get(i).Pricebook2.Name == 'Standard Price Book'){
                Map<String, Object> productsRatingMap = getProductRatingIdForProduct(productsRating, pricebookEntryList.get(i).Product2.Id);
                jsonItem.put('productId',pricebookEntryList.get(i).Product2.Id);
                jsonItem.put('pricebookId', pricebookEntryList.get(i).Id);
                jsonItem.put('productPrice',pricebookEntryList.get(i).UnitPrice);
                jsonItem.put('productName',pricebookEntryList.get(i).Product2.Name);
                jsonItem.put('author',pricebookEntryList.get(i).Product2.Book_author__c);
                jsonItem.put('director',pricebookEntryList.get(i).Product2.Director__c);
                jsonItem.put('description', pricebookEntryList.get(i).Product2.Description);
                jsonItem.put('releaseDate', pricebookEntryList.get(i).Product2.Release_date__c);
                jsonItem.put('averageRating', productsRatingMap!=null?productsRatingMap.get('averageRating'):0);
                jsonItem.put('countRating', productsRatingMap!=null?productsRatingMap.get('countRating'):0);
                jsonItem.put('productMainPic', ''+findAttachmentIdForResult(mainPics, pricebookEntryList.get(i)));
                for(Integer j=0; j<pricebookEntryList.size(); j++){
                    if(pricebookEntryList.get(i).Product2.Id == pricebookEntryList.get(j).Product2.Id && pricebookEntryList.get(j).Pricebook2.Name == 'Regular Discount'){
                        jsonItem.put('discountPrice',pricebookEntryList.get(j).UnitPrice);
                    }
                }
                serializedProducts.add(jsonItem);
            }
        }
        return serializedProducts;
    }
}