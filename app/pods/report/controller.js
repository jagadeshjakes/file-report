import Ember from 'ember';
import $ from 'jquery';
export default Ember.Controller.extend({

  xAxis:'no',
  yAxis:'no',
  filter:null,
  matrixData:null,
  filterData:null,
  viewMatrix:false,
  viewFilter:false,

pieOptions: {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false
  },
  title: {
      text: 'File report'
  },
  tooltip: {
      pointFormat: 'count: <b>{point.y}</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}% ',
          style: {
              color: 'black'
          },
          connectorColor: 'silver'
      }
    }
  }
},

  init(){
    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', this, function() {
    this.checkLastView();
  });

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
  });
  this.set('matrixData',datas);
  this.set('viewFilter',false);
  this.set('viewMatrix',true);
  },
  checkLastView:function(){
    var datas;
    $.ajax({
		    type:"POST",
		    url:"/getlastview",
        async:false,
		    success:function(data){
          console.log(data);
          datas=data;
		      }
      });
      if(datas!=='null'){
        var table="<table class='table'><tr>";
        $.each(datas.columns,function(index,object){
          table=table+"<th>"+object+"</th>";
        });
        table=table+"</tr>";
        $.each(datas.view,function(index,object){
          table=table+"<tr>";
          $.each(object,function(ind,obj){
            table=table+"<td>"+obj+"</td>";
          });
          table=table+"</tr>";
        });
        var head="Last viewed <br>Table:"+datas.table+", "+datas.xaxis+":"+datas.xvalue+", "+datas.yaxis+":"+datas.yvalue;
        $('.modal-title').html(head);
        $('#modal-content').html(table);
        $('#mymodal').modal('toggle');
      }
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
    hideFilter:function(){
      this.set('viewFilter',false);
    },
    hideMatrix:function(){
      this.set('viewMatrix',false);

    },
    getvertex(x,y){
      console.log(x,y);
      if(x!==0 && y!==0){
      var dat=this.get('matrixData');
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
      });
      var table="<table class='table'><tr>";
      $.each(this.get('model.columns'),function(index,object){
        table=table+"<th>"+object.columnName+"</th>";
      });
      table=table+"</tr>";
      $.each(datas,function(index,object){
        table=table+"<tr>";
        $.each(object,function(ind,obj){
          table=table+"<td>"+obj+"</td>";
        });
        table=table+"</tr>";
      });
      var head=this.get('xAxis')+":"+dat[x][0]+" "+this.get('yAxis')+":"+dat[0][y];
      $('.modal-title').html(head);
      $('#modal-content').html(table);
      console.log(head);
      //console.log(table);
      $('#mymodal').modal('toggle');
    }
    },
    doFilter:function(){
      var datas;
      $.ajax({
  		type:"POST",
  		url:"/getfilterdata",
      async:false,
  		data:{tableName:this.get('model.table'),columns:JSON.stringify(this.get('model.columns'))},
  		success:function(data){
        console.log(data);
        datas=data;
  		}
    });
    this.set('filterData',datas);
    this.set('viewMatrix',false);
    this.set('viewFilter',true);
    },
    drawChart(colName){
      var datas;
      $.ajax({
  		type:"POST",
  		url:"/getchartdata",
      async:false,
  		data:{tableName:this.get('model.table'),columnName:colName},
  		success:function(data){
        console.log(data);
        datas=data;
  		}
    });
    var defaults={
      series:datas
    };
    var pieData=Ember.merge(defaults,this.get("pieOptions"));
    $('.modal-title').html(colName+" from "+this.get('model.table'));
    $('#modal-content').highcharts(pieData).highcharts();
    $('#mymodal').modal('toggle');

  },
  showColumns:function(){
    var columns = this.get('model.columns').filterBy('isChecked', true);
    columns = columns.mapBy('columnName');
    console.log(columns);
    var datas;
    $.ajax({
    type:"POST",
    url:"/getselectedcolumns",
    async:false,
    data:{tableName:this.get('model.table'),columns:JSON.stringify(columns)},
    success:function(data){
        console.log(data);
        datas=data;
      }
    });
    this.set('filterData',datas);
    this.set('viewMatrix',false);
    this.set('viewFilter',true);
    }
  }
});
