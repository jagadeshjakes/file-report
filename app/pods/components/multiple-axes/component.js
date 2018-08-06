import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  classNames: ['multiple-axes'],
  chart:null,
  pages:null,
  chartData:null,
  chartAxes:null,
  xAxis:'no',
  tXAxis:'no',
  file:null,
  chartTypes:["line","area","column","scatter"],
  spinner:new Spinner({
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
  }),
  target:document.getElementById('tem-content'),
  actions:{
    setXAxis:function(value){
      this.set('xAxis',value);
    },
    setType:function(index,flag,name){
      console.log(index,flag,name);
      if(flag==='time'){
        this.set('file.columns.'+index+'.timeChart',name);
        console.log(this.get('file.columns')[index]);
      }
      else{
        this.set('file.columns.'+index+'.axesChart',name);
        console.log(this.get('file.columns')[index]);
      }
    },
    showAxes:function(){
      var here=this;
      var axes = this.get('file.columns').filterBy('isAxesCheck', true);
      var types=axes.mapBy('isNumeric');
      var chart=axes.mapBy('axesChart');
      axes=axes.mapBy('columnName');
      //console.log(axes);
      //console.log(types);
      var x=this.get('xAxis');
      var index = axes.indexOf(x);
      var spinner=this.get('spinner');
      var target=this.get('target');
      if(index!==-1){
        axes.splice(index, 1);
        types.splice(index,1);
        chart.splice(index,1);
      }
      index=chart.indexOf(undefined);
      var ind=chart.indexOf("no");
      if(index===-1 && ind===-1){
      if(axes.length!==0 && x!=='no'){
        this.set('chartAxes',axes);
        var options;
        spinner.spin(target);
        $.ajax({
            type:"POST",
            url:"/getaxes",
            data:{tableName:this.get('file.table'),xaxis:x,yaxis:JSON.stringify(axes),types:JSON.stringify(types),chart:JSON.stringify(chart)},
            success:function(data){
                    options=data;
                   }
          }).then(function(){
            console.log(options);
            $('.modal-title').html("x-Axis:"+x+" y-Axis:"+axes);
            here.set('chartData',options);
            $('#chart-content').highcharts(options);
            here.set('chart',$('#chart-content').highcharts());
            $('#chart-modal').modal('toggle');
            spinner.stop();
          });

      }
      else {
        alert('X axis not selected or select Y axes other than X-axis or select type of chart');
      }
    }
    else{
      alert("select chart type");
    }

  },
  changedType(index,type){
    var col=this.get('chartAxes')[index];
    var options=this.get('chart');
    var loop=this.get('chartData');
    $.each(loop.series,function(ind,object){
      console.log(object);
      if(object.colName===col){
        console.log(object);
        options.series[ind].update({
          type:type
        });
      }
    });
  },
//-----------------------------------------------------Time Series------------------------------
  setTXAxis:function(value){
    this.set('tXAxis',value);
    console.log();
  },
  showTimeSeries:function(page){
    var here=this;
    var x=this.get('tXAxis');
    var axes = this.get('file.columns').filterBy('isTimeCheck', true);
    var color=axes.mapBy('color');
    var negative=axes.mapBy('negative');
    var threshold=axes.mapBy('threshold');
    var chart=axes.mapBy('timeChart');
    axes=axes.mapBy('columnName');
    var spinner=this.get('spinner');
    var target=this.get('target');
    var index=chart.indexOf(undefined);
    var ind=chart.indexOf("no");
    $.each(color,function(ind,object){
      if(object===undefined){
        color[ind]='#99ccff'
      }
    });
    $.each(negative,function(ind,object){
      if(object===undefined){
        negative[ind]='#ff5050'
      }
    });
    $.each(threshold,function(ind,object){
      if(object===undefined){
        threshold[ind]=0
      }
    });
    console.log(threshold);
    if(index===-1 && ind===-1){
      if(axes.length!==0 && x!=='no'){
        this.set('chartAxes',null);
        var datas;
        spinner.spin(target);
        $.ajax({
            type:"POST",
            url:"/gettimeseries",
            data:{tableName:this.get('file.table'),xaxis:x,yaxis:JSON.stringify(axes),chart:JSON.stringify(chart),
            color:JSON.stringify(color),negative:JSON.stringify(negative),threshold:JSON.stringify(threshold),page:page-1},
            success:function(data){
                    datas=data;
                    console.log(data);
                   }
          }).then(function(){
            var options=datas.options;
            var pages=[]
            for(var i=0;i<=datas.pages;i++){
              var ob;
              if(i===(page-1)){
                ob={
                  "num":i+1,
                  "isPage":false,
                }
              }
              else{
                ob={
                  "num":i+1,
                  "isPage":true
                }
              }
              pages.push(ob);
            }
            here.set('pages',pages);
            $('#chart-table').html("<div id=\"chart-content\">"+
            "</div>");
            $('.modal-title').html("x-Axis:"+x+" y-Axis:"+axes);
            here.set('chartData',options);
            $('#chart-content').highcharts(options);
            here.set('chart',$('#chart-content').highcharts());
            if(page==1){
            $('#chart-modal').modal('toggle');
            }
            spinner.stop();
          });


      }else{
        alert('X or y axis not selected');
      }
    }else {
      alert('select chart type');
    }
  },
  exportPDF(){
    //var doc=new jsPDF();
    var svg = this.get('chart').getSVG();
    if (svg)
      svg = svg.replace(/\r?\n|\r/g, '').trim();

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');


    context.clearRect(0, 0, canvas.width, canvas.height);
    canvg(canvas, svg);
    var imgData = canvas.toDataURL('image/png');
  // Generate PDF
    var doc = new jsPDF('p', 'pt', 'a4');
    var csv=this.get('chart').getCSV();
    var lines=csv.split("\n");
    var columns=lines[0].split(",");
    var rows=[]
    for(var i=1;i<lines.length;i++){
	     rows.push(lines[i].split(','));
    }
    doc.addImage(imgData, 'PNG', 40, 40,500, 350);
    doc.autoTable(columns, rows, {startY:400});
    //doc.autoTable(columns, rows);

    doc.save('test.pdf');
  }

  }
});
