import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({

  showLoad:false,
  xAxis:'no',
  yAxis:'no',
  filter:null,
  matrixData:null,
  filterData:null,
  viewMatrix:false,
  viewFilter:false,
  viewChart:false,
  spinner:null,
  target:null,
  chart:null,
  chartAxes:null,
  chartTypes:null,
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
    },
    series:{
        turboThreshold:1000
    }
  }
},

  init(){
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
    this.checkLastView();
  });
  },
  showTable:function(){
    if((this.get('xAxis')!=='no') && (this.get('yAxis')!=='no')){
      if(this.get('xAxis')!==this.get('yAxis')){
        return true;
      }
      else{
        alert('XAxis and Yaxis should not be same');
        return false;
      }
    }
    else{
      alert('XAxis or Yaxis should not be null');
      return false;
    }
  },
  checkDrill(){
    var columns=this.get('model.columns');
    var x=this.get('xAxis');
    var y=this.get('yAxis');
    var xstat=false;
    var ystat=false;
    $.each(columns,function(index,object){
      if(object.columnName===x){ //&& object.key!=='UNI' && object.key!=='PRI'){
        xstat=true;
      }
      else if(object.columnName===y){ //&& object.key!=='UNI' && object.key!=='PRI'){
        ystat=true;
      }

    });
    if(xstat&&ystat){
      return true;
    }
    else{
      alert('Cannot show drilldown for unique values');
      return false;
    }
  },
  checkLastView:function(){
    var types=["line","area","column","scatter"];
    this.set('chartTypes',types);
    this.set('target',document.getElementById('tem-content'));
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
    this.set('spinner',new Spinner(opts));

    var datas;
    var spinner=this.get('spinner');
    var target=this.get('target');
    spinner.spin(target);
    $.ajax({
		    type:"POST",
		    url:"/getlastview",
        async:false,
		    success:function(data){
          console.log(data);
          datas=data;
		      }
      }).then(function(){
        spinner.stop();
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
      });

  },
  actions:{
    setXAxis:function(value){
      this.set('xAxis',value);
    },
    setYAxis:function(value){
      this.set('yAxis',value);
    },
    showMatrix:function(){
      if(this.showTable()){
        var datas;
        var it=this;
        var spinner=this.get('spinner');
        var target=this.get('target');
        spinner.spin(target);
        $.ajax({
  		      type:"POST",
  		      url:"/getmatrix",
  		      data:{tableName:this.get('model.table'),xaxis:this.get('xAxis'),yaxis:this.get('yAxis')},
  		      success:function(data){
                    datas=data;
  		             }
          }).then(function(){
            spinner.stop();
            it.set('matrixData',datas);
            it.set('viewFilter',false);
            it.set('viewMatrix',true);
          });
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
      var it=this;
      var spinner=this.get('spinner');
      var target=this.get('target');
      spinner.spin(target);
        $.ajax({
    		type:"POST",
    		url:"/getdata",
        async:false,
    		data:{tableName:this.get('model.table'),xaxis:this.get('xAxis'),yaxis:this.get('yAxis'),xvalue:dat[0][y],yvalue:dat[x][0]},
    		success:function(data){
          console.log(data);
          datas=data;
    		}
      }).then(function(){
        spinner.stop();
        var table="<table class='table'><tr>";
        $.each(it.get('model.columns'),function(index,object){
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
        var head=it.get('xAxis')+":"+dat[0][y]+" "+it.get('yAxis')+":"+dat[x][0];
        $('.modal-title').html(head);
        $('#modal-content').html(table);
        console.log(head);
        $('#mymodal').modal('toggle');
      });
    }
    },
    doFilter:function(){
      var datas;
      var it=this;
      var spinner=this.get('spinner');
      var target=this.get('target');
      spinner.spin(target);
      $.ajax({
  		type:"POST",
  		url:"/getfilterdata",
      async:false,
  		data:{tableName:this.get('model.table'),columns:JSON.stringify(this.get('model.columns'))},
  		success:function(data){
        console.log(data);
        datas=data;
  		}
    }).then(function(){
      spinner.stop();
      it.set('filterData',datas);
      it.set('viewMatrix',false);
      it.set('viewFilter',true);
    });
    },
    drawChart(colName){
      var datas;
      var it=this;
      var spinner=this.get('spinner');
      var target=this.get('target');
      spinner.spin(target);
      $.ajax({
  		type:"POST",
  		url:"/getchartdata",
      async:false,
  		data:{tableName:this.get('model.table'),columnName:colName},
  		success:function(data){
        console.log(data);
        datas=data;
  		}
    }).then(function(){
      spinner.stop();
      var defaults={
        series:datas
      };
      var pieData=Ember.merge(defaults,it.get("pieOptions"));
      $('.modal-title').html(colName+" from "+it.get('model.table'));
      $('#modal-content').highcharts(pieData).highcharts();
      $('#mymodal').modal('toggle');
    });


  },
  showColumns:function(){
    var columns = this.get('model.columns').filterBy('isChecked', true);
    columns = columns.mapBy('columnName');
    console.log(columns);
    var datas;
    var it=this;
    var spinner=this.get('spinner');
    var target=this.get('target');
    spinner.spin(target);
    $.ajax({
    type:"POST",
    url:"/getselectedcolumns",
    async:false,
    data:{tableName:this.get('model.table'),columns:JSON.stringify(columns)},
    success:function(data){
        console.log(data);
        datas=data;
      }
    }).then(function(){
      spinner.stop();
      it.set('filterData',datas);
      it.set('viewMatrix',false);
      it.set('viewFilter',true);
    });

  },
  showDrillDown:function(){
    if(this.showTable()&&this.checkDrill()){
      var datas;
      var spinner=this.get('spinner');
      var target=this.get('target');
      var x=this.get('xAxis');
      var y=this.get('yAxis');
      spinner.spin(target);
      $.ajax({
          type:"POST",
          url:"/getdrilldowndata",
          data:{tableName:this.get('model.table'),xaxis:this.get('xAxis'),yaxis:this.get('yAxis')},
          success:function(data){
                  datas=data;
                 }
        }).then(function(data){
          $('.modal-title').html("x-Axis:"+x+" y-Axis:"+y);
          $('#modal-content').highcharts(data).highcharts();
          $('#mymodal').modal('toggle');

          spinner.stop();
        });
    }
  },
  showAxes:function(){
    var here=this
    var axes = this.get('model.columns').filterBy('isCheck', true);
    var types=axes.mapBy('isNumeric');
    var chart=axes.mapBy('value');
    axes=axes.mapBy('columnName');
    console.log(axes);
    console.log(types);
    var x=this.get('xAxis');
    var index = axes.indexOf(x);
    var spinner=this.get('spinner');
    var target=this.get('target');
    if(index!==-1){
      axes.splice(index, 1);
      types.splice(index,1);
      chart.splice(index,1);
    }
    index=chart.indexOf("");
    console.log(index);
    if(index===-1){
    if(axes.length!==0 && x!=='no'){
      this.set('chartAxes',axes);
      var options;
      spinner.spin(target);
      $.ajax({
          type:"POST",
          url:"/getaxes",
          data:{tableName:this.get('model.table'),xaxis:x,yaxis:JSON.stringify(axes),types:JSON.stringify(types),chart:JSON.stringify(chart)},
          success:function(data){
                  options=data;
                 }
        }).then(function(){
          console.log(options);
          $('.modal-title').html("x-Axis:"+x+" y-Axis:"+axes);
          here.set('viewChart',true);
          here.set('chartData',options);
          $('#chart-content').highcharts(options)
          here.set('chart',$('#chart-content').highcharts());
          $('#chart-modal').modal('toggle');
          spinner.stop();
        })

    }
    else {
      alert('X axis not selected or select Y axes other than X-axis or select type of chart');
    }
  }
  else{
    alert("select chart type");
  }

  },
  setType:function(index,name){
    console.log(index,name);
    this.set('model.columns.'+index+'.value',name);
    console.log(this.get('model.columns')[index]);

  },
  swapAxis:function(){
    var arr=this.get('matrixData');
      var trans=arr[0].map((col, i) => arr.map(row => row[i]));
    console.log(trans);
    this.set('matrixData',trans);
    var t=this.get('xAxis');
    this.set('xAxis',this.get('yAxis'));
    this.set('yAxis',t);
    this.set('viewMatrix',false);
    this.set('viewMatrix',true);
  },
  changeType(index,type){
    var options=this.get('chart');
    options.series[index].update({
      type:type
    });
    console.log(options);
  },
  changedType(index,type){
    var col=this.get('chartAxes')[index];
    var options=this.get('chart');
    var loop=this.get('chartData')
    $.each(loop.series,function(ind,object){
      console.log(object);
      if(object.colName===col){
        console.log(object);
        options.series[ind].update({
          type:type
        });
      }
    })
  }
}

});
