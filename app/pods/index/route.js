import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    var datas;
    $.ajax({
      type:"POST",
      url:"/getfiles",
      async:false,
      success:function(data){
        datas= data;
      }
    });
      console.log(datas);
      return datas;
  }
});
