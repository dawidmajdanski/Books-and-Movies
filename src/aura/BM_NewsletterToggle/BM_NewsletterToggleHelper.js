/**
 * Created by Dawid Majdański on 04.03.2019.
 */
({
    toggleOn: function(component){
          document.getElementById('switchBtn').style = 'left: 99px !important;';
          document.getElementById('subscribedInfo').style = 'width: 128px; !important;';
    },
    toggleOff: function(component){
          document.getElementById('switchBtn').style = 'left: 0px !important;';
          document.getElementById('subscribedInfo').style = 'width: 0px; !important;';
    }
})