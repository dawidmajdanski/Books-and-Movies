/**
 * Created by Majdan on 27.12.2018.
 */

public with sharing class BM_LocationsRecordCrud {

    @AuraEnabled
    public static List<Account> getShops(String shopCountry, String shopCity, String shopStreet){

        String searchquery = 'Select Name, BillingCountry, BillingCity, BillingStreet, BillingLatitude, BillingLongitude, Id From Account Where RecordType.name like \'Shop\'';
        if (String.isNotBlank(shopCountry) || String.isNotBlank(shopCity) || String.isNotBlank(shopStreet)) {
            searchquery += searchquery.contains('like') && String.isNotBlank(shopCountry) ? ' and' : '';
            searchquery += String.isNotBlank(shopCountry) ? ' BillingCountry like \'' + shopCountry + '%\'' : '';
            searchquery += searchquery.contains('like') && String.isNotBlank(shopCity) ? ' and' : '';
            searchquery += String.isNotBlank(shopCity) ? ' BillingCity like \'' + shopCity + '%\'' : '';
            searchquery += searchquery.contains('like') && String.isNotBlank(shopStreet) ? ' and' : '';
            searchquery += String.isNotBlank(shopStreet) ? ' BillingStreet like \'' + shopStreet + '%\'' : '';
        }
        searchquery += ' ORDER BY Name';

        return  Database.query(searchquery);
    }

    @AuraEnabled
    public static Account updateThisShop(Account acc){
        List<Account> accounts = new List<Account>();
        accounts.add(acc);
        try{
            update accounts;
            return accounts.get(0);
        }catch (DmlException e){
            throw new AuraHandledException(System.Label.DML_error_message
                    + e.getMessage());
        }
    }

    @AuraEnabled
    public static Account getUpdatedShop(Account acc){
        return [SELECT Id, Name, BillingCity, BillingCountry, BillingStreet, BillingLatitude, BillingLongitude, Phone, Website FROM Account WHERE Id =: acc.Id];
    }

    @AuraEnabled
    public static Account deleteThisShop(Account acc){
        try{
            delete acc;
            return acc;
        }catch (DmlException e){
            throw new AuraHandledException(System.Label.DML_error_message
                    + e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean getUserPermissionSet(){
        List<PermissionSetAssignment> permsetForGivenUser = [SELECT Id
                                     FROM PermissionSetAssignment
                                     WHERE AssigneeId = :UserInfo.getUserId()
                                     AND PermissionSet.Name = 'BM_Custom_buttons_visibility'];

        return permsetForGivenUser.size()!=0;
    }

    @AuraEnabled
    public static List<Shop_employee__c> getEmployees(Account acc){
        List<Shop_employee__c> employees = [SELECT Employee__c, Employee__r.Name, Employee__r.FirstName, Employee__r.LastName FROM Shop_employee__c where Shop__c =: acc.Id];
        return employees;
    }

    @AuraEnabled
    public static Shop_employee__c removeEmployeeFromShop(String empId){
        List<Shop_employee__c> employee = [SELECT id, Employee__c, Shop__c FROM Shop_employee__c where Id =: empId];

        try{
            delete employee;
            return employee.get(0);
        }catch (DmlException e){
            throw new AuraHandledException(System.Label.DML_error_message
                    + e.getMessage());
        }
    }

}