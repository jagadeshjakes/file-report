import Ember from 'ember';

export default Ember.Component.extend({
  xAxis:null,
  chartTypes:["line","area","column","scatter"],
  actions:{
    setXAxis:function(value){
      this.set('xAxis',value);
      console.log(value);
    },
    setType:function(index,type){
      console.log(index,name);
      //this.set('file.columns.'+index+'.value',name);
      //console.log(this.get('file.columns')[index]);
    },
    showTimeSeries:function(){

    }
  }
});
