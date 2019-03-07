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

    global static List<Object> getPopularProducts(){
        return BM_ProductSearchController.getPopularProducts();
    }

    global void execute(SchedulableContext ctx) {
        List<Object> objs= BM_ProductSearchController.getPopularProducts();
        List<String> mails = BM_Newsletter.newsletterMembersEmails();

        if(mails.size()!=0){
            String dateFormatString = 'yyyy-MM-dd';
            Date d = Date.today();
            Datetime dt = Datetime.newInstance(d.year(), d.month(),d.day());
            String dateString = dt.format(dateFormatString);


            String body = '<div><h1 style="font-size: 150%; text-align: center; border-bottom: 1px solid gainsboro; color: dimgray;">Check out our new products</h1></div>';
            body +='<div style="padding: 1rem; display: inline-block; width: 100%;">';
            for(Object o: objs){
                Map<String, Object> resultProduct = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(o));
                body+='<div style="float:left; width: 187px; height: 224px; position: relative; margin: 2px;">';
                body+='<a href="https://britenetdmajdanski-developer-edition.eu16.force.com/s/details?id='+String.valueOf(resultProduct.get('productId'))+'"><img style="border: 1px solid rgb(193, 193, 193, 0.6); width:100%; height: 100%; position:absolute; object-fit: contain;cursor: pointer;" src="'+String.valueOf(resultProduct.get('productMainPic'))+'"/></a>';
                body+='</div>';
            }
            body += '</div>';
            body += '<div style="text-align: center; padding-top: 15px; border-top: 1px solid gainsboro; margin-top: 15px;"> <a href="https://britenetdmajdanski-developer-edition.eu16.force.com/s/"><img style="width: 7%; margin-left: 41.5%; cursor: pointer;" src="https://booksandmovies-dev-ed--c.documentforce.com/servlet/servlet.ImageServer?id=0151t000000LBVs&oid=00D1t000000qdvN&lastMod=1551658354000"/></a> </div>';

            BM_EmailUtils.sendMail(mails, 'Books&Movies Newsletter: '+dateString, body);
        }

    }

}