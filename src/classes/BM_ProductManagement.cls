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
        List<Product2> product = [SELECT Id, (SELECT ContentDocument.Title, ContentDocument.Id FROM ContentDocumentLinks) FROM Product2 WHERE Id =: productId];
        List<Object> serializedPics = new List<Object>();
        for(ContentDocumentLink cd: product.get(0).ContentDocumentLinks){
            Map<String, Object> jsonItem = new Map<String, Object>();
            List<ContentDistribution> contentDistr = [SELECT ContentDownloadUrl FROM ContentDistribution WHERE ContentDocumentId =: cd.ContentDocument.Id];
            jsonItem.put('pictureId', cd.ContentDocument.Id);
            jsonItem.put('pictureName', cd.ContentDocument.Title);
            jsonItem.put('pictureURL', contentDistr.get(0).ContentDownloadUrl);
            serializedPics.add(jsonItem);
        }
        return serializedPics;
    }

    @AuraEnabled
    public static Boolean updatePicturesNames(String newMainPic, String productId){
        List<ContentDocument> picToUpdate = [SELECT Id, Title From ContentDocument WHERE Id =: newMainPic];
        List<ContentDocumentLink> pics = [SELECT Id, ContentDocument.Title From ContentDocumentLink WHERE LinkedEntityId =: productId];
        String tempPicName;

        for(ContentDocumentLink item: pics){
            if(item.ContentDocument.Title.contains(System.Label.Main_picture_name)){
                tempPicName = picToUpdate.get(0).Title;
                item.ContentDocument.Title = tempPicName;
                try{
                    update item.ContentDocument;
                }catch (DmlException e){
                    system.debug(e);
                }
                break;
            }
        }
        try{
            picToUpdate.get(0).Title = System.Label.Main_picture_name;
            update picToUpdate;
            return true;
        }catch (DmlException e){
            return false;
        }
    }

    @AuraEnabled
    public static Boolean pictureDeletion(String picToDel, String productId){
        List<ContentDocumentLink> pics = [SELECT ContentDocument.Id, ContentDocument.Title From ContentDocumentLink WHERE LinkedEntityId =: productId AND ContentDocument.Id =: picToDel];
        List<ContentDistribution> contentD = [SELECT Id FROM ContentDistribution WHERE ContentDocumentId =: pics.get(0).ContentDocument.Id];
        try{
            delete contentD;
            delete pics;
        }catch (DmlException e){
            return false;
        }
        return true;
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
        newPricebook.isActive=true;
       try{
           insert newPricebook;
       }catch (DmlException e){
           system.debug(e);
       }
    }
}