/**
 * Created by Majdan on 04.02.2019.
 */

public with sharing class BM_SearchUtils {

    public static List<String> parseQueryPricebookEntrySearch(Map<String, Object> searchParams){
        List<String> queryList = new List<String>();

        for(String paramKey: searchParams.keySet()){
            if(String.isNotBlank(String.valueOf(searchParams.get(paramKey)))) {
                switch on paramKey {
                    when 'minPrice' {
                        queryList.add('AND UnitPrice>=' + Decimal.valueOf(String.valueOf(searchParams.get(paramKey))) + ' ');
                    }
                    when 'maxPrice' {
                        queryList.add('AND UnitPrice<=' + Decimal.valueOf(String.valueOf(searchParams.get(paramKey))) + ' ');
                    }
                    when 'pricebookName' {
                        queryList.add('AND Pricebook2.Name=\'' + String.valueOf(searchParams.get(paramKey)) + '\' ');
                    }
                }
            }
        }
        return queryList;
    }

    public static List<String> parseQueryProductSearch(Map<String, Object> searchParams){
        List<String> queryList = new List<String>();

        for(String paramKey: searchParams.keySet()){
            if(String.isNotBlank(String.valueOf(searchParams.get(paramKey)))) {
                switch on paramKey {
                    when 'productType' {
                        queryList.add(parseProductCategory(String.valueOf(searchParams.get(paramKey))));
                    }
                    when 'searchText' {
                        if (String.valueOf(searchParams.get(paramKey)).length() >= 2) {
                            queryList.add('AND Name like \'%' + searchParams.get(paramKey) + '%\' ');
                        }
                    }
                    when 'specificYear' {
                        queryList.add('AND CALENDAR_YEAR(Release_date__c)=' + Integer.valueOf(searchParams.get(paramKey)) + ' ');
                    }
                    when 'minYear' {
                        queryList.add('AND CALENDAR_YEAR(Release_date__c)>=' + Integer.valueOf(searchParams.get(paramKey)) + ' ');
                    }
                    when 'maxYear' {
                        queryList.add('AND CALENDAR_YEAR(Release_date__c)<=' + Integer.valueOf(searchParams.get(paramKey)) + ' ');
                    }
                    when 'author'{
                        queryList.add('AND Book_author__c like \'%' + String.valueOf(searchParams.get(paramKey)) + '%\' ');
                    }
                    when 'bookGenre'{
                        queryList.add('AND Book_genres__c includes (\'' + String.valueOf(searchParams.get(paramKey)) + '\') ');
                    }
                    when 'director'{
                        queryList.add('AND Director__c like \'%' + String.valueOf(searchParams.get(paramKey)) + '%\' ');
                    }
                    when 'movieGenre'{
                        queryList.add('AND Movie_genres__c includes (\'' + String.valueOf(searchParams.get(paramKey)) + '\') ');
                    }
                    when 'productId'{
                        queryList.add('AND Id =\'' + String.valueOf(searchParams.get(paramKey)) + '\' ');
                    }
                }
            }
        }
        return queryList;
    }

    private static String parseProductCategory(String productCategory){
        if(productCategory==System.Label.All_tab){
             return '(RecordType.Name=\'Book\' or RecordType.Name=\'Movie\') ';
        }else{
            if(productCategory==System.Label.Books_tab){
                return 'RecordType.Name=\''+System.Label.Book_record_type+'\' ';
            }else{
                if(productCategory==System.Label.Movies_tab){
                    return 'RecordType.Name=\''+System.Label.Movie_record_type+'\' ';
                }
            }
        }
        return null;
    }

    public static Integer parseQueryAvgRating(Map<String, Object> searchParams){
        List<String> queryList = new List<String>();

        for(String paramKey: searchParams.keySet()){
            if(String.isNotBlank(String.valueOf(searchParams.get(paramKey)))) {
                switch on paramKey {
                    when 'minRating' {
                        return Integer.valueOf(String.valueOf(searchParams.get(paramKey)));
                    }
                }
            }
        }
        return null;
    }

    public static List<Product2> searchByAvgRating(List<Product2> productsList, Integer averageRating){
        List<Product2> newList = new List<Product2>();
        for(Product2 p: productsList){
            Decimal avgProdRat = 0;
            if(p.Product_rating__r.size()>0){
                for(Product_rating__c pr: p.Product_rating__r){
                    avgProdRat+=pr.Rating__c;
                }
                avgProdRat=avgProdRat/p.Product_rating__r.size();
            }
            if(avgProdRat>=averageRating){
                newList.add(p);
            }
        }
        return newList;
    }

}