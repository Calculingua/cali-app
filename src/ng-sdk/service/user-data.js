define([
], function () {
	
	function Service($http, $cookies, $q){
		var self = this;
		this.username = $cookies.username;
		this.ga = $cookies.ga;
		this.env = $cookies.env;
		this.stripeKey = $cookies.stripeKey;
		
		this.getOptions = function(){
			
			if(self.options){
				return $q.when(self.options);
				
			}else{
				return $http({
					url: "/app/account/" + $cookies.username,
					type: "GET"})
					.then(function(res) {
						self.options = res.data;
						return self.options;
					})
					.catch(function(error) {
						console.error(error);
					});
			}
		};
	}

  return ["$http", "$cookies", "$q", Service];
	


});