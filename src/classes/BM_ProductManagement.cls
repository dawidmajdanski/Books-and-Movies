/**
 * Created by Majdan on 03.02.2019.
 */

public class BM_ProductManagement {

    @AuraEnabled
    public static List<Product2> getProducts(){
        return [SELECT Id, Name FROM Product2 WHERE RecordType.Name=:System.Label.Book_record_type OR RecordType.Name=:System.Label.Movie_record_type];
    }

    @AuraEnabled
    public static Id saveChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) {
        if (fileId == '') {
            fileId = saveTheFile(parentId, fileName, base64Data, contentType);
        } else {
            appendToFile(fileId, base64Data);
        }
        return Id.valueOf(fileId);
    }

    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        List<Attachment> oAttachment = new List<Attachment>();
        if(oAttachment.size()==0){
            oAttachment.add(new Attachment());
            oAttachment.get(0).parentId = parentId;
        }
        oAttachment.get(0).Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.get(0).Name = fileName;
        oAttachment.get(0).ContentType = contentType;
        upsert oAttachment;
        return oAttachment.get(0).Id;
    }

    private static void appendToFile(Id fileId, String base64Data) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        Attachment a = [
                SELECT Id, Body
                FROM Attachment
                WHERE Id =: fileId
        ];
        String existingBody = EncodingUtil.base64Encode(a.Body);
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data);
        update a;
    }

    @AuraEnabled
    public static List<Object> getPicturesForProduct(String productId){
        List<Attachment> results = [SELECT ParentId, Name, Id FROM Attachment WHERE ParentId =: productId];
        String picturePrefix = System.Label.Picture_url_prefix;

        List<Object> serializedPictures = new List<Object>();
        for(Integer i=0; i<results.size(); i++){
            Map<String, Object> jsonItem = new Map<String, Object>();
            String picName = results.get(i).Name.replaceAll('^[^.]+$|\\.(?!(js|exe)$)([^.]+$)','');
            jsonItem.put('pictureId',results.get(i).Id);
            jsonItem.put('pictureName', picName);
            jsonItem.put('pictureURL', ''+picturePrefix+results.get(i).Id);
            serializedPictures.add(jsonItem);
        }
        return serializedPictures;
    }

    @AuraEnabled
    public static Boolean updatePicturesNames(String newMainPic, String productId){
        List<Attachment> results = [SELECT ParentId, Name, Id FROM Attachment WHERE ParentId =: productId];
        String picturePrefix = System.Label.Picture_url_prefix;
        Attachment picture = getAttachment(results, newMainPic);
        String tempPicName;
        for(Attachment item: results){
            if(item.Name.contains(System.Label.Main_picture_name)){
                tempPicName = picture.Name;
                item.Name = tempPicName;
                break;
            }
        }
        try{
            picture.Name = System.Label.Default_main_pic_name;
            update picture;
            update results;
        }catch (DmlException e){
            return false;
        }
        return true;
    }

    @AuraEnabled
    public static Boolean pictureDeletion(String picToDel, String productId){
        List<Attachment> results = [SELECT ParentId, Name, Id FROM Attachment WHERE ParentId =: productId AND Id =: picToDel];
        try{
            delete results;
        }catch (DmlException e){
            return false;
        }
        return true;
    }

    public static Attachment getAttachment(List<Attachment> attList, String attId){
        for(Attachment a: attList){
            if(a.Id == attId){
                return a;
            }
        }
        return null;
    }

    @AuraEnabled
    public static List<Pricebook2> getPriceBooks(){
        return [SELECT
        (SELECT Id, UnitPrice, Standard_price__c, Discount_percentage__c, Name, Product2.Name, Product2.Id
        FROM PricebookEntries WHERE IsActive=true AND (Product2.RecordType.Name = 'Book' OR Product2.RecordType.Name = 'Movie')), Id, Name, Start_date__c, End_date__c, Ongoing_promotion__c
        FROM Pricebook2 WHERE Ongoing_promotion__c = true];
    }

    @AuraEnabled
    public static List<Pricebook2> getInactivePriceBooks(){
        return [SELECT
        (SELECT Id, UnitPrice, Standard_price__c, Discount_percentage__c, Name, Product2.Name, Product2.Id
        FROM PricebookEntries WHERE IsActive=true AND (Product2.RecordType.Name = 'Book' OR Product2.RecordType.Name = 'Movie')), Id, Name, Start_date__c, End_date__c, Ongoing_promotion__c
        FROM Pricebook2 WHERE Ongoing_promotion__c = false];
    }

    @AuraEnabled
    public static List<Object> getPromoProducts(){
        String searchquery = 'Select (Select Pricebook2.Name, Pricebook2.Id, Standard_price__c, ProductCode, Discount_percentage__c, UnitPrice FROM PricebookEntries WHERE Discount_percentage__c != null), RecordType.Name, Release_date__c, Director__c, Book_author__c, Description, Name From Product2 WHERE RecordType.Name = \''+System.Label.Book_record_type+'\' OR RecordType.Name = \''+System.Label.Movie_record_type+'\'';
        List<Product2> productList = new List<Product2>();
        productList = Database.query(searchquery);
        return BM_ProductUtils.parseObj(productList);
    }

    @AuraEnabled
    public static List<Object> searchForProducts(String searchObj) {
        return BM_ProductUtils.searchAction(searchObj);
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
    public static void changeStartDate(String priceBookId, Date newDate){
        List<Pricebook2> pricebookToUpdate = [SELECT Id FROM Pricebook2 WHERE Id =: priceBookId];
        pricebookToUpdate.get(0).Start_date__c = newDate;
        try{
            update pricebookToUpdate;
        }catch (DmlException e){
            system.debug(e);
        }
    }

    @AuraEnabled
    public static void changeEndDate(String priceBookId, Date newDate){
        List<Pricebook2> pricebookToUpdate = [SELECT Id FROM Pricebook2 WHERE Id =: priceBookId];
        pricebookToUpdate.get(0).End_date__c = newDate;
        try{
            update pricebookToUpdate;
        }catch (DmlException e){
            system.debug(e);
        }
    }

    @AuraEnabled
    public static Boolean removeSinglePromotion(String promoProductId){
        List<PricebookEntry> discountProduct = [
                SELECT  Product2.RecordType.Name,
                        Product2.Release_date__c,
                        Product2.Director__c,
                        Product2.Book_author__c,
                        Product2.Description,
                        Pricebook2.Name,
                        Pricebook2.Id,
                        Product2.Name,
                        UnitPrice,
                        ProductCode,
                        Discount_percentage__c,
                        Standard_price__c
                From PricebookEntry
                WHERE Id =: promoProductId] ;
        discountProduct.get(0).IsActive=false;
        discountProduct.get(0).Discount_percentage__c=null;
        discountProduct.get(0).UnitPrice=discountProduct.get(0).Standard_price__c;
        update discountProduct;
        return true;
    }

    @AuraEnabled
    public static Boolean removePromotions(){
        List<PricebookEntry> discountProduct = [
                SELECT  Product2.RecordType.Name,
                        Product2.Release_date__c,
                        Product2.Director__c,
                        Product2.Book_author__c,
                        Product2.Description,
                        Pricebook2.Name,
                        Pricebook2.Id,
                        Product2.Name,
                        UnitPrice,
                        ProductCode,
                        Discount_percentage__c
                From PricebookEntry WHERE Pricebook2.Id =: System.Label.Regular_discount_pricebook_id] ;
        delete discountProduct;
        return true;
    }

    @AuraEnabled
    public static Boolean addDiscountToProducts(String pricebookId, List<String> ids, Decimal discount){
        List<Product2> productsToDiscount = [
                SELECT RecordType.Name,
                Release_date__c,
                Director__c,
                Book_author__c,
                Name,
                Description,
                (SELECT Pricebook2.Name,
                        Pricebook2.Id,
                        Pricebook2Id,
                        Product2.Name,
                        UnitPrice,
                        ProductCode,
                        IsActive,
                        Discount_percentage__c,
                        Standard_price__c
                FROM PricebookEntries)
        From Product2 WHERE Id in :ids];

        List<PricebookEntry> newPricebookEntryList = new List<PricebookEntry>();
        List<PricebookEntry> entriesToUpdate = new List<PricebookEntry>();
        for(Product2 product: productsToDiscount){
            Boolean productIsInPricebook = false;
            for(PricebookEntry entry: product.PricebookEntries){
                if(entry.Pricebook2Id==pricebookId && entry.Pricebook2.Name!=System.Label.Standard_pricebook_name){
                    productIsInPricebook = true;
                    entry.Discount_percentage__c=discount;
                    entry.isActive = true;
                    entry.UnitPrice =  entry.Standard_price__c - (entry.Standard_price__c * discount);
                    entriesToUpdate.add(entry);
                }
            }
            if(!productIsInPricebook){
                PricebookEntry newPricebookEntry = new PricebookEntry();
                newPricebookEntry.Standard_price__c = product.PricebookEntries.get(0).Standard_price__c;
                newPricebookEntry.UnitPrice = product.PricebookEntries.get(0).Standard_price__c - (product.PricebookEntries.get(0).Standard_price__c * discount);
                newPricebookEntry.Product2Id = product.Id;
                newPricebookEntry.Pricebook2Id = pricebookId;
                newPricebookEntry.IsActive = true;
                newPricebookEntry.Discount_percentage__c=discount;
                newPricebookEntryList.add(newPricebookEntry);
            }

        }
        if(entriesToUpdate.size()!=0){
            update entriesToUpdate;
        }
        if(newPricebookEntryList.size()!=0){
            insert newPricebookEntryList;
        }
        return true;
    }

    @AuraEnabled
    public static void createNewPricebook(Pricebook2 newPricebook){
       try{
           insert newPricebook;
       }catch (DmlException e){
           system.debug(e);
       }
    }
}