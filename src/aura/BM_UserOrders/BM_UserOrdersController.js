/**
 * Created by Dawid Majdański on 08.03.2019.
 */
({
    handleCases: function(component, event, helper){
       let cases = component.find("caseList");
       if(cases){
           cases.getCases();
       }else{
           console.errror('No such component: caseList');
       }
    }
})