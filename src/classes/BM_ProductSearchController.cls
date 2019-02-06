/**
 * Created by Dawid Majdański on 31.01.2019.
 */

public class BM_ProductSearchController {
    @AuraEnabled
    public static List<Object> searchForProducts(String searchObj) {
        system.debug(searchObj);
        List<String> queryParams = BM_SearchUtils.parseQuery(searchObj);
        String searchquery = 'Select Pricebook2.Name, Product2.Name, UnitPrice, ProductCode From PricebookEntry WHERE ';

        for(String param: queryParams){
            searchquery += param;
        }
        system.debug(searchquery);

        List<PricebookEntry> results = new List<PricebookEntry>();
        if(!queryParams.isEmpty()){
            results = Database.query(searchquery);
        }

        List<String> productIds = getIds(results);
        List<Attachment> mainPics = getMainPictures(productIds);

        List<Object> serializedProducts = new List<Object>();
        for(Integer i=0; i<results.size(); i++){
            Map<String, Object> jsonItem = new Map<String, Object>();
            jsonItem.put('productId',results.get(i).Product2.Id);
            jsonItem.put('productPrice',results.get(i).UnitPrice);
            jsonItem.put('productName',results.get(i).Product2.Name);
            jsonItem.put('productMainPic', ''+findAttachmentIdForResult(mainPics, results.get(i)));
            serializedProducts.add(jsonItem);
        }
        return serializedProducts;
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

}