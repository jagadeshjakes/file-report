import Ember from 'ember';
import $ from 'jquery';
export default Ember.Route.extend({
  model(table){
		var datas;
    $.ajax({
		type:"POST",
		url:"/getcolumns",
    async:false,
		data:{tableName:table.name},
		success:function(data){
      //console.log(data);
			datas={columns:data,table:table.name};
		}
	});
	console.log(datas);
	return datas;
	}

});
