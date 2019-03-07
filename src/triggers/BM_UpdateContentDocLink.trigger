/**
 * Created by Majdan on 03.03.2019.
 */

trigger BM_UpdateContentDocLink on ContentDocumentLink (before insert) {
    for(ContentDocumentLink cdl: Trigger.new){
        cdl.Visibility = 'AllUsers';
    }
}