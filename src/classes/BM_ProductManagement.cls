/**
 * Created by Majdan on 03.02.2019.
 */

public class BM_ProductManagement {

    @AuraEnabled
    public static List<Product2> getProducts(){
        return [SELECT Id, Name FROM Product2 WHERE RecordType.Name='Book' OR RecordType.Name='Movie'];
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
        String picturePrefix = 'https://booksandmovies-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file=';

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
        String picturePrefix = 'https://booksandmovies-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file=';
        Attachment picture = getAttachment(results, newMainPic);
        String tempPicName;
        for(Attachment item: results){
            if(item.Name.contains('Main')){
                tempPicName = picture.Name;
                item.Name = tempPicName;
                break;
            }
        }
        try{
            picture.Name = 'Main.jpg';
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


}