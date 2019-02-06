/**
 * Created by Majdan on 04.02.2019.
 */

public with sharing class BM_SearchUtils {

    public static List<String> parseQuery(String searchObj){
        List<String> queryList = new List<String>();
        Map<String, Object> searchParams = (Map<String, Object>) JSON.deserializeUntyped(searchObj);

        for(String paramKey: searchParams.keySet()){
            if(String.isNotBlank(String.valueOf(searchParams.get(paramKey)))) {
                switch on paramKey {
                    when 'productType' {
                        queryList.add(parseProductCategory(String.valueOf(searchParams.get(paramKey))));
                    }
                    when 'searchText' {
                        if (String.valueOf(searchParams.get(paramKey)).length() >= 2) {
                            queryList.add('AND Product2.Name like \'%' + searchParams.get(paramKey) + '%\' ');
                        }
                    }
                    when 'minPrice' {
                        queryList.add('AND UnitPrice>=' + Decimal.valueOf(String.valueOf(searchParams.get(paramKey))) + ' ');
                    }
                    when 'maxPrice' {
                        queryList.add('AND UnitPrice<=' + Decimal.valueOf(String.valueOf(searchParams.get(paramKey))) + ' ');
                    }
                    when 'specificYear' {
                        queryList.add('AND CALENDAR_YEAR(Product2.Release_date__c)=' + Integer.valueOf(searchParams.get(paramKey)) + ' ');
                    }
                    when 'minYear' {
                        queryList.add('AND CALENDAR_YEAR(Product2.Release_date__c)>=' + Integer.valueOf(searchParams.get(paramKey)) + ' ');
                    }
                    when 'maxYear' {
                        queryList.add('AND CALENDAR_YEAR(Product2.Release_date__c)<=' + Integer.valueOf(searchParams.get(paramKey)) + ' ');
                    }
                    when 'author'{
                        queryList.add('AND Product2.Book_author__c like \'%' + String.valueOf(searchParams.get(paramKey)) + '%\' ');
                    }
                    when 'bookGenre'{
                        queryList.add('AND Product2.Book_genres__c includes (\'' + String.valueOf(searchParams.get(paramKey)) + '\') ');
                    }
                    when 'director'{
                        queryList.add('AND Product2.Director__c like \'%' + String.valueOf(searchParams.get(paramKey)) + '%\' ');
                    }
                    when 'movieGenre'{
                        queryList.add('AND Product2.Movie_genres__c includes (\'' + String.valueOf(searchParams.get(paramKey)) + '\') ');
                    }
                }
            }
        }

        return queryList;
    }

    private static String parseProductCategory(String productCategory){
        if(productCategory=='AllTab'){
             return '(Product2.RecordType.Name=\'Book\' or Product2.RecordType.Name=\'Movie\') ';
        }else{
            if(productCategory=='BookTab'){
                return 'Product2.RecordType.Name=\'Book\' ';
            }else{
                if(productCategory=='MovieTab'){
                    return 'Product2.RecordType.Name=\'Movie\' ';
                }
            }
        }
        return null;
    }

}