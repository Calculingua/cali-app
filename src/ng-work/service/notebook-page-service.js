define([
], function(){
	
	function NotebookPageServerModel($http, $q) {
		var self = this;
		var storage = [];
		var temp = [];
		this.length = 0;
		
		this.setPath = function(path){
			self.path = path;
		};
		
		this.setEntries = function(data){
			storage = data;
		};

		this.clear = function(){
			storage = [];
			temp = [];
			self.length = 0;
		};

		this.push = function(type, data, callback) {
			try {
				temp.push({
					type : type,
					data : data
				});
				self.length += 1;
				if (callback) {
					callback(null);
				}
			} catch (ex) {
				if (callback) {
					callback(ex);
				} else {
					throw ex;
				}
			}
			setTimeout(self.serverSync, 10);
		};
	
		this.update = function(i, type, data, callback) {
			try {
				temp[i] = {
					type : type,
					data : data
				};
				if (callback) {
					callback(null);
				}
			} catch (ex) {
				if (callback) {
					callback(ex);
				} else {
					throw ex;
				}
			}
		};

		this.serverSync = function serverSync(callback) {
			//console.log("NotebookPageServerModel path:", self.path);
			function finishup(err, n) {
				if (!err) {
					//console.log("sync complete:", n);
				} else {
					//console.log("sync completed with errors:", err);
				}

				if (callback) {
					callback(err, n);
				}
			}
			//console.log("syncing with server");
			if (temp.length === 0) {
				return finishup(null, 0);
			}
			if (self.path) {
				var syncingItems = temp.slice(0);
				temp = [];
				$.ajax({
					url : self.path,
					type : "POST",
					data : JSON.stringify(syncingItems),
					contentType : 'application/json',
					success : function(data) {
						storage = storage.concat(syncingItems);
						finishup(null, syncingItems.length);
					},
					error : function(xhr, status, error) {
						finishup(error);
					}
				});
			} else {
				finishup("No path specified");
			}
		};
		
		setInterval(function() {
			self.serverSync();
		}, 5000);

		this.publish = function(path, title, callback){
			storage = storage.concat(temp);
			temp = [];
			if (path && title) {
				path += "/page";
				var data = {
					title : title,
					entries : storage
				};
				//console.log(data);
				$.ajax({
					url : path,
					type : "POST",
					data : JSON.stringify(data),
					contentType : 'application/json',
					success : function(data) {
						path += ("/" + data.page);
						//self.path = path;
						temp = [];
						callback(null);
					},
					error : function(xhr, status, error) {
						callback(error);
					}
				});
			} else {
				callback("path not specified");
			}
		};
		
		this.bindNew = function(path, title){
			var def;
			if(path){
				path += "/page";
				def = $http.post(path, {title: title})
					.then(function(res){
						self.pathpath = path + "/" + res.data.page;
						
					});
				return def;
			}else{
				def = $q.defer();
				return def.reject("no path specified");
			}
		};
		
		this.bindLatest = function(path){
			path += "/page";
			var def = $http.get(path + "?limit=1")
				.then(function(res) {
					path += "/" + res.data[0].page;
					return $http.get(path)
						.then(function(res) {
							self.path = path;
							self.setEntries(res.data.entries);
						});
				});
			return def;
		};
	}

	// attach the factory methods to the proper place
	function Factory($http, $q){
		
		function create(){
			return new NotebookPageServerModel($http, $q);
		}
		
		return {create : create};
	}
		
	return ["$http", "$q", Factory];
	
});