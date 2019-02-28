/**
 * Created by Dawid Majdański on 13.02.2019.
 */
({
    bottomTitleAnimation: function(){
        setTimeout($A.getCallback(function(){
            document.getElementById('thanks-comm').style = 'height: 100px;';
        }), 450);
    },
})