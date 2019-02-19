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

    public static List<Attachment> getMainPictures(List<String> productIds){
        if(productIds.size()!=0){
            String query = 'Select ParentId, Id, Name FROM Attachment WHERE Name like \'%'+System.Label.Main_picture_name+'%\' AND (';
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

    public static String findAttachmentIdForResult(List<Attachment> attList, PricebookEntry resultItem){
        for(Attachment a: attList){
            if(a.ParentId==resultItem.Product2.Id){
                return System.Label.Picture_url_prefix+a.Id;
            }
        }
        return System.Label.Product_placeholder_url_prefix+PageReference.forResource('ProductPlaceholder').getUrl();
    }

    public static List<String> getIds(List<PricebookEntry> objectList){
        List<String> ids = new List<String>();
        for(PricebookEntry entry: objectList){
            ids.add(entry.Product2.Id);
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

    public static Map<String, Object> getParsedJSON(PricebookEntry priceBookEntryItem, List<AggregateResult> productsRating, List<Attachment> mainPics){
        Map<String, Object> productsRatingMap = BM_ProductUtils.getProductRatingIdForProduct(productsRating, priceBookEntryItem.Product2.Id);
        Map<String, Object> jsonItem = addJsonKey(priceBookEntryItem);
        jsonItem.put('averageRating', productsRatingMap!=null?productsRatingMap.get('averageRating'):0);
        jsonItem.put('countRating', productsRatingMap!=null?productsRatingMap.get('countRating'):0);
        jsonItem.put('productMainPic', ''+BM_ProductUtils.findAttachmentIdForResult(mainPics, priceBookEntryItem));
        return jsonItem;
    }

    public static Map<String, Object> addJsonKey(PricebookEntry priceBookEntryItem){
        Map<String, Object> jsonItem = new Map<String, Object>();
        jsonItem.put('productPrice', priceBookEntryItem.UnitPrice);
        jsonItem.put('productName', priceBookEntryItem.Product2.Name);
        jsonItem.put('author',priceBookEntryItem.Product2.Book_author__c);
        jsonItem.put('director',priceBookEntryItem.Product2.Director__c);
        jsonItem.put('description', priceBookEntryItem.Product2.Description);
        jsonItem.put('releaseDate', priceBookEntryItem.Product2.Release_date__c);
        jsonItem.put('pricebookId', priceBookEntryItem.Pricebook2.Id);
        jsonItem.put('pricebookEntryId', priceBookEntryItem.Id);
        jsonItem.put('productId', priceBookEntryItem.Product2.Id);
        jsonItem.put('productRecordType', priceBookEntryItem.Product2.RecordType.Name);
        return jsonItem;
    }
}