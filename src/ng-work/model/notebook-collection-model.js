define([
], function(){

	function Service($q, $http, userData) {

		this.create = function(data) {
			return $http.post("/app/account/" + userData.username + "/notebook", data)
				.success(function(res) {
					return res.data;
				});
		};

		this.findAll = function() {
			return $http.get("/app/account/" + userData.username + "/notebook")
				.then(function(res) {
					return res.data;
				});
		};

		this.findOne = function(query) {
			return $http.get("/app/account/" + userData.username + "/notebook/" + query.notebook)
				.success(function(res) {
					return res;
				});
		};

		this.findOneAndUpdate = function(query, data) {
			return $http.put("/app/account/" + userData.username + "/notebook/" + query.notebook, data)
				.success(function(res) {
					return res;
				});
		};

		this.remove = function(query, callback) {
			return $http.delete("/app/account/" + userData.username + "/notebook/" + query.notebook)
				.success(function(res) {
					return res;
				});
		};
	}
	
    return ["$q", "$http", "UserData", Service];

});