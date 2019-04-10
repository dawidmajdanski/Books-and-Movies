/**
 * Created by Dawid Majdański on 23.01.2019.
 */

@IsTest
private class BM_Tests {

    static testMethod void testBehavior1(){
        System.assertEquals(0,0);
    }

    static testMethod void testBehavior2(){
        System.assertNotEquals(0,1);
    }
}