/**
 * Created by Majdan on 02.01.2019.
 */

public class BM_EmployeesManagement {

    @AuraEnabled
    public static List<Account> getShops(){
        return [SELECT Id, Name, BillingCountry, BillingCity, BillingStreet, BillingLatitude, BillingLongitude
        FROM Account WHERE RecordType.Name = 'Shop'];
    }

    @AuraEnabled
    public static List<User> getEmployees(){
        return [SELECT Id, Name, LastName, FirstName, Profile.UserLicense.Name
        FROM User WHERE Profile.UserLicense.Name like '%Salesforce%'];
    }

    @AuraEnabled
    public static List<Shop_employee__c> getAssignedEmployees(){
        return [SELECT Id, Name, Employee__c, Shop__c FROM Shop_employee__c];
    }

    @AuraEnabled
    public static Shop_employee__c assignEmployeeToShop(String empId, String shopId){
        Shop_employee__c shopEmp = new Shop_employee__c();

        shopEmp.Employee__c = empId;
        shopEmp.Shop__c = shopId;
        try{
            insert shopEmp;
        }catch (DmlException e){
            throw new AuraHandledException('Something went wrong: '
                    + e.getMessage());
        }
        return shopEmp;
    }

}