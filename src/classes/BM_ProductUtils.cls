/**
 * Created by Majdan on 14.02.2019.
 */

public with sharing class BM_ProductUtils {

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

    public static String getMainPicture(Product2 resultItem){
        if(UserInfo.getUserId()!=System.Label.Guest_user){
            for(ContentDocumentLink cd: resultItem.ContentDocumentLinks){
                if(cd.ContentDocument.Title==System.Label.Main_picture_name){
                    return [SELECT ContentDownloadUrl FROM ContentDistribution WHERE ContentDocumentId =: cd.ContentDocument.Id].get(0).ContentDownloadUrl;
                }
            }
            return System.Label.Product_placeholder_url_prefix+PageReference.forResource('ProductPlaceholder').getUrl();
        }
        return null;
    }

    public static List<String> getIds(List<Product2> objectList){
        List<String> ids = new List<String>();
        for(Product2 entry: objectList){
            ids.add(entry.Id);
        }
        return ids;
    }

    public static List<AggregateResult> getRatingForProducts(List<String> productIds){
        if(productIds.size()!=0){
            List<AggregateResult> productRating = [SELECT COUNT(Rating__c) countRating, AVG(Rating__c) averageRating, Product__c productID FROM Product_rating__c group by Product__c HAVING Product__c in :(productIds) ];
            return productRating;
        }
        return null;
    }

    public static Map<String, Object> getParsedJSON(Product2 productItem, List<AggregateResult> productsRating){
        Map<String, Object> productsRatingMap = BM_ProductUtils.getProductRatingIdForProduct(productsRating, productItem.Id);
        Map<String, Object> jsonItem = addJsonKey(productItem);
        jsonItem.put('averageRating', productsRatingMap!=null?productsRatingMap.get('averageRating'):0);
        jsonItem.put('countRating', productsRatingMap!=null?productsRatingMap.get('countRating'):0);
        jsonItem.put('productMainPic', ''+BM_ProductUtils.getMainPicture(productItem));
        return jsonItem;
    }

    public static Map<String, Object> addJsonKey(Product2 productItem){
        Map<String, Object> jsonItem = new Map<String, Object>();
        jsonItem.put('productName', productItem.Name);
        jsonItem.put('author',productItem.Book_author__c);
        jsonItem.put('director',productItem.Director__c);
        jsonItem.put('description', productItem.Description);
        jsonItem.put('releaseDate', productItem.Release_date__c);
        jsonItem.put('productId', productItem.Id);
        jsonItem.put('productRecordType', productItem.RecordType.Name);
        return jsonItem;
    }

    public static List<Object> parseObj(List<Product2> productsList){
        List<String> productIds = BM_ProductUtils.getIds(productsList);
        List<AggregateResult> productsRating = BM_ProductUtils.getRatingForProducts(productIds);
        List<Object> serializedProducts = new List<Object>();
        for(Integer i = 0; i < productsList.size(); i++){
            if(productsList.get(i).PricebookEntries.size()!=0) {
                Map<String, Object> jsonItem = BM_ProductUtils.getParsedJSON(productsList.get(i), productsRating);
                PricebookEntry lowestEntry = productsList.get(i).PricebookEntries.get(0);
                String standardPricebookEntryId = null;
                for(PricebookEntry pBookEntry: productsList.get(i).PricebookEntries){
                    standardPricebookEntryId = pBookEntry.Pricebook2.Name==System.Label.Standard_pricebook_name?pBookEntry.Id:standardPricebookEntryId;
                    if(pBookEntry.UnitPrice<lowestEntry.UnitPrice){
                        lowestEntry = pBookEntry;
                    }
                }
                if(productsList[i].Favourite_products__r.size()!=0){
                    jsonItem.put('isFavourite', true);
                }else{
                    jsonItem.put('isFavourite', false);
                }
                jsonItem.put('standardPrice', lowestEntry.Standard_price__c);
                jsonItem.put('pricebookId', lowestEntry.Pricebook2.Id);
                jsonItem.put('price', lowestEntry.UnitPrice);
                jsonItem.put('pricebookName', lowestEntry.Pricebook2.Name);
                jsonItem.put('pricebookEntryId', standardPricebookEntryId);
                if(lowestEntry.Standard_price__c!=lowestEntry.UnitPrice) {
                    jsonItem.put('discountPercentage', lowestEntry.Discount_percentage__c);
                }
                serializedProducts.add(jsonItem);
            }
        }
        return serializedProducts;
    }

    public static List<Object> searchAction(String searchObj) {
        String productQuery='';
        String pricebookEntryQuery='';
        String currentUser = UserInfo.getUserId();
        Map<String, Object> searchParams = (Map<String, Object>) JSON.deserializeUntyped(searchObj);
        List<String> productSearchParams = BM_SearchUtils.parseQueryProductSearch(searchParams);
        List<String> pricebookEntryParams = BM_SearchUtils.parseQueryPricebookEntrySearch(searchParams);
        Integer avgRating = BM_SearchUtils.parseQueryAvgRating(searchParams);
        for(String param: productSearchParams){
            productQuery += param;
        }
        for(String param: pricebookEntryParams){
            pricebookEntryQuery += param;
        }
        String searchQuery = 'Select RecordType.Name, Release_date__c, Director__c, Book_author__c, Description, Name, ' +
                '(SELECT IsActive, Pricebook2.Name, UnitPrice, ProductCode, Discount_percentage__c, Standard_price__c FROM PricebookEntries WHERE Pricebook2.Ongoing_promotion__c=true AND IsActive = true '+pricebookEntryQuery+'), ' +
                '(SELECT User__c, Product__c FROM Favourite_products__r WHERE User__c = \''+currentUser+'\'),' +
                '(SELECT ContentDocument.Title, ContentDocument.Id, Visibility FROM ContentDocumentLinks), ' +
                '(SELECT Rating__c, Product__c FROM Product_rating__r) ' +
                'FROM Product2 WHERE '+productQuery;

        List<Product2> results = new List<Product2>();
        if(productQuery!='' || pricebookEntryQuery!=''){
            results = Database.query(searchQuery);
        }

        if(avgRating>0){
            results = BM_SearchUtils.searchByAvgRating(results, avgRating);
        }

        system.debug(searchQuery);

        return BM_ProductUtils.parseObj(results);
    }

}