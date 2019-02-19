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
    public static List<Object> getPromoProducts(){
        String searchquery = 'Select Product2.RecordType.Name, Product2.Release_date__c, Product2.Director__c, Product2.Book_author__c, Product2.Description, Pricebook2.Name, Pricebook2.Id, Product2.Name, UnitPrice, ProductCode, Discount_percentage__c From PricebookEntry WHERE Product2.RecordType.Name = \''+System.Label.Book_record_type+'\' OR Product2.RecordType.Name = \''+System.Label.Movie_record_type+'\'';
        List<PricebookEntry> pricebookEntryList = new List<PricebookEntry>();
        pricebookEntryList = Database.query(searchquery);
        List<Object> serializedProducts = new List<Object>();
        for(Integer i=0; i<pricebookEntryList.size(); i++){
            if(pricebookEntryList.get(i).Pricebook2.Name == System.Label.Standard_pricebook_name){
                for(Integer j=0; j<pricebookEntryList.size(); j++){
                    if(pricebookEntryList.get(i).Product2.Id == pricebookEntryList.get(j).Product2.Id && pricebookEntryList.get(j).Pricebook2.Name == System.Label.Regular_discount_pricebook_name){
                        Map<String, Object> jsonItem = BM_ProductUtils.addJsonKey(pricebookEntryList.get(j));
                        jsonItem.put('discountPrice', pricebookEntryList.get(j).UnitPrice);
                        jsonItem.put('discountPercentage', pricebookEntryList.get(j).Discount_percentage__c);
                        jsonItem.put('productPrice', pricebookEntryList.get(i).UnitPrice);
                        serializedProducts.add(jsonItem);
                    }
                }
            }
        }
        return serializedProducts;
    }

    @AuraEnabled
    public static List<Object> searchForProducts(String searchObj) {
        List<String> queryParams = BM_SearchUtils.parseQuery(searchObj);
        String searchquery = 'Select Product2.RecordType.Name, Product2.Release_date__c, Product2.Director__c, Product2.Book_author__c, Product2.Description, Pricebook2.Name, Pricebook2.Id, Product2.Name, UnitPrice, ProductCode, Discount_percentage__c From PricebookEntry WHERE ';

        for(String param: queryParams){
            searchquery += param;
        }

        List<PricebookEntry> results = new List<PricebookEntry>();
        if(!queryParams.isEmpty()){
            results = Database.query(searchquery);
        }

        return BM_ProductSearchController.parseObj(results);
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
                        Discount_percentage__c
                From PricebookEntry
                WHERE Id =: promoProductId] ;
        delete discountProduct;
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
    public static Boolean addDiscountToProducts(List<String> ids, Decimal discount){
        List<PricebookEntry> productsToDiscount = [
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
        From PricebookEntry WHERE Product2.Id in :ids];
        List<PricebookEntry> newProductsWithDiscount = new List<PricebookEntry>();
        for(PricebookEntry product: productsToDiscount){
            if(product.Pricebook2Id == System.Label.Regular_discount_pricebook_id){
                delete product;
            }else{
                PricebookEntry newProductEntry = product.clone();
                newProductEntry.Pricebook2Id = System.Label.Regular_discount_pricebook_id;
                newProductEntry.Discount_percentage__c = discount;
                newProductEntry.UnitPrice = product.UnitPrice - (product.UnitPrice * discount);
                newProductEntry.IsActive = true;
                newProductsWithDiscount.add(newProductEntry);
            }
        }
        upsert newProductsWithDiscount;
        return true;
    }
}