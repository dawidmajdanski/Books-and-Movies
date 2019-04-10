/**
 * Created by Dawid Majdański on 01.03.2019.
 */

global with sharing class BM_Newsletter implements Schedulable {

    global static List<String> newsletterMembersEmails(){
        List<Newsletter_member__c> membersList =  [SELECT User__c, User__r.Name, User__r.Email FROM Newsletter_member__c];
        List<String> emails = new List<String>();
        for(Newsletter_member__c member: membersList){
            emails.add(member.User__r.Email);
        }
        return emails;
    }

    global void execute(SchedulableContext ctx) {
        List<String> mails = BM_Newsletter.newsletterMembersEmails();

        if(mails.size()!=0){
            String dateFormatString = 'yyyy-MM-dd';
            Date d = Date.today();
            Datetime dt = Datetime.newInstance(d.year(), d.month(),d.day());
            String dateString = dt.format(dateFormatString);

            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            PageReference page = new PageReference('/apex/BM_NewsletterEmailBody');
            page.setRedirect(true);
            mail.setSenderDisplayName('Book&Movies Newsletter');
            mail.toAddresses = mails;
            mail.setSubject('Books&Movies Newsletter '+dateString);
            mail.setHtmlBody(page.getContent().toString());
            Messaging.SendEmailResult [] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        }

    }

}