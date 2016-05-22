define([
], function(){
	
	function Factory($http, $q, userData){
		
		var basePath = "/app/account/" + userData.username + "/notebook";
		
		this.findAll = function() {
			return $http.get(basePath)
				.then(function(res) {
					return res.data;
				});
		};
		
		this.create = function(opts){
			
			return $http.post(basePath, opts);
		};
		
		this.edit = function(notebookId, opts){
			return $http.put(basePath + "/" + notebookId, opts);
		};
		
		this.remove = function(notebookId){
			return $http.delete(basePath + "/" + notebookId);
		};
		
		this.newPage = function(notebookId, title){
			return $http.post(basePath + "/" + notebookId + "/page", {title : title});
		};
		
		this.addPageItems = function(notebookId, pageId, items){
			return $http.post(basePath + "/" + notebookId + "/page/" + pageId, items);
		};
	}
	
    return ["$http", "$q", "UserData", Factory];
});