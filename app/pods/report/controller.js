import Ember from 'ember';

export default Ember.Controller.extend({

  xAxis:'no',
  yAxis:'no',
  filter:null,
  matrixData:null,
  viewMatrix:false,
  init(){
    this._super(...arguments);
    this.set('tableName',this.get('model.table'));
    this.set('columns',this.get('model.columns'));
  },
  showMatrix:function(){
  var datas;
    $.ajax({
		type:"POST",
		url:"/getmatrix",
    async:false,
		data:{tableName:this.get('model.table'),xaxis:this.get('xAxis'),yaxis:this.get('yAxis')},
		success:function(data){
      //console.log(data);
      datas=data;
		}
  }),
  this.set('matrixData',datas);
  this.set('viewMatrix',true);
  },
  actions:{
    setXAxis:function(value){
      this.set('yAxis',value);
      //console.log(value);
    },
    setYAxis:function(value){
      this.set('xAxis',value);
      //console.log(value);
    },
    showTable:function(){
      if((this.get('xAxis')!=='no') && (this.get('yAxis')!=='no')){
        if(this.get('xAxis')!==this.get('yAxis')){
          this.showMatrix();
        }
        else{
          alert('XAxis and Yaxis should not be same');
        }
      }
      else{
        alert('XAxis or Yaxis should not be null');
      }
    },
    hideTable:function(){
      this.set('viewMatrix',false);
    },
    getvertex(x,y){
      //console.log(x,y);
      var dat=this.get('matrixData.rowData');
      var datas;
        $.ajax({
    		type:"POST",
    		url:"/getdata",
        async:false,
    		data:{tableName:this.get('model.table'),xaxis:this.get('xAxis'),yaxis:this.get('yAxis'),xvalue:dat[x][0],yvalue:dat[0][y]},
    		success:function(data){
          console.log(data);
          datas=data;
    		}
      })
      var table="<table class='table'><tr>";
      $.each(this.get('model.columns'),function(index,object){
        table=table+"<th>"+object+"</th>"
      })
      table=table+"</tr>"
      $.each(datas,function(index,object){
        table=table+"<tr>"
        $.each(object,function(ind,obj){
          table=table+"<td>"+obj+"</td>"
        })
        table=table+"</tr>"
      })
      var head=this.get('xAxis')+":"+dat[x][0]+" "+this.get('yAxis')+":"+dat[0][y];
      $('.modal-title').html(head);
      $('.modal-body').html(table);
      console.log(head);
      //console.log(table);
      $('#mymodal').modal('toggle');

    }
  }
});
