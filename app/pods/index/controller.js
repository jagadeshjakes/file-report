import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    upload:function(){
      var form = $('#fileUploadForm')[0];
      var data = new FormData(form);
      $("#btnSubmit").prop("disabled", true);
      $.ajax({
          type: "POST",
          enctype: 'multipart/form-data',
          url: "/upload",
          data: data,
          async:false,
          processData: false,
          contentType: false,
          cache: false,
          success: function (data) {
              console.log("SUCCESS");
          }
      });
      location.reload();
    }
  }
});
