/**
 * Created by Dawid Majdański on 07.03.2019.
 */

public without sharing class BM_NewsletterProductCollector {
    public List<BM_NewsletterProductCollector.Products> newsletterProducts {get; set;}

    public BM_NewsletterProductCollector(){
       List<Object> objs = BM_ProductSearchController.getPopularProducts();
       newsletterProducts = new List<BM_NewsletterProductCollector.Products>();
       for(Object o: objs){
            Map<String, Object> resultProduct = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(o));
            newsletterProducts.add(new BM_NewsletterProductCollector.Products(String.valueOf(resultProduct.get('productId')), String.valueOf(resultProduct.get('productName')), String.valueOf(resultProduct.get('productMainPic'))));
       }
    }

    public class Products{
        public String productId {get; set;}
        public String productName {get; set;}
        public String pictureUrl {get; set;}

        public Products(String productId, String productName, String pictureUrl){
            this.productId=productId;
            this.productName=productName;
            this.pictureUrl=pictureUrl;
        }
    }

}