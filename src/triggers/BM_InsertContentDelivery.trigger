/**
 * Created by Majdan on 03.03.2019.
 */

trigger BM_InsertContentDelivery on ContentVersion (after insert) {
    List<ContentDistribution> cd = new List<ContentDistribution>();
    List<ContentVersion> newContentVer = Trigger.new;
    for(ContentVersion c: newContentVer){
        cd.add(new ContentDistribution(Name =  c.Title, ContentVersionId = c.Id));
    }
    insert cd;
}