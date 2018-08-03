import Ember from 'ember';
import $ from 'jquery';
export default Ember.Controller.extend({
  init(){
    this._super(...arguments);
    //var ProgressBar = require('progressbar.js')

  },
  actions:{
    upload:function(){
      var target=document.getElementById('tem-content');
      var opts = {
        lines: 10, // The number of lines to draw
        length: 38, // The length of each line
        width: 17, // The line thickness
        radius: 45, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#19DBF0', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
      };
      var spinner=new Spinner(opts);
      var form = $('#fileUploadForm')[0];
      var data = new FormData(form);
      spinner.spin(target);
      $.ajax({
          type: "POST",
          enctype: 'multipart/form-data',
          url: "/upload",
          data: data,
          async:false,
          processData: false,
          contentType: false,
          cache: false,
          success: function () {
              console.log("SUCCESS");
          }
      }).then(function(){
        location.reload();
      });

    }
  }
});
