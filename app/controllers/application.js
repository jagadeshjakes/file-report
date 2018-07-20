import Ember from 'ember';
import $ from 'jquery';
export default Ember.Controller.extend({
  actions:{
		logout(){
			$.ajax({
				type:"POST",
				async:false,
				url:"/logout",
				success:function(){
					console.log("logged out");
				}
			});
			location.reload();
		}
  }
});
