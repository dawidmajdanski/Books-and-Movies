/**
 * Created by Dawid Majdański on 04.03.2019.
 */

public with sharing class BM_UserNewsletter {
    @AuraEnabled
    public static Boolean getUserSubscriptionStatus(){
        return [SELECT User__r.Email, User__c FROM Newsletter_member__c WHERE User__c =: UserInfo.getUserId()].size()!=0?true:false;
    }

    
    @AuraEnabled
    public static Boolean userSubscriptionChange(){
        String currentUser = UserInfo.getUserId();
        List<Newsletter_member__c> currentMember = [SELECT User__c FROM Newsletter_member__c WHERE User__c =: currentUser];
        if(currentMember.size()==0){
            Newsletter_member__c newMember = new Newsletter_member__c();
            newMember.User__c = currentUser;
            insert newMember;
            return true;
        }else{
            delete currentMember;
            return false;
        }
    }

}