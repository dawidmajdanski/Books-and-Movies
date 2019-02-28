/**
 * Created by Dawid Majdański on 26.02.2019.
 */

public without sharing class BM_FavouritesController {

    @AuraEnabled
    public static void addProductToFavourites(String productId){
        String currentUserId = UserInfo.getUserId();
        Favourite_product__c userFavouriteMovie = new Favourite_product__c();
        userFavouriteMovie.User__c = currentUserId;
        userFavouriteMovie.Product__c = productId;
        try{
            insert userFavouriteMovie;
        }catch (DmlException e){
            system.debug(e);
        }
    }

    @AuraEnabled
    public static void removeProductFromFavourites(String productId){
        String currentUserId = UserInfo.getUserId();
        List<Favourite_product__c> productToRemove = [SELECT Id, User__c, Product__c FROM Favourite_product__c WHERE Product__c =: productId AND User__c =: currentUserId];
        try{
            delete productToRemove;
        }catch (DmlException e){
            system.debug(e);
        }
    }
    
    @AuraEnabled
    public static List<Object> getAllUserFavouriteProducts(){
        String currentUser = UserInfo.getUserId();
        List<Product2> userFavouriteProducts = [
                SELECT Name, Description, Book_author__c, Director__c, Movie_genres__c, Book_genres__c, Release_date__c, RecordType.Name,
                    (SELECT UnitPrice, Standard_price__c, Pricebook2.Name, Discount_percentage__c, IsActive, ProductCode FROM PricebookEntries WHERE Pricebook2.Ongoing_promotion__c = true AND IsActive = true),
                    (SELECT User__c, Product__c
                    FROM Favourite_products__r
                    WHERE User__c =: currentUser)
                FROM Product2];
        List<Product2> productListToParse = new List<Product2>();
        for(Product2 product: userFavouriteProducts){
            if(product.Favourite_products__r.size()!=0){
                productListToParse.add(product);
            }
        }

        return BM_ProductUtils.parseObj(productListToParse);
    }

}