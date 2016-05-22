define([
], function(){
	
	function FileSidebarController($scope, $rootScope, fileModel, userData, $timeout, analytics) {
		var self = this;
		
		$scope.busy = false;
		$scope.showLinkPopup = false;
		$scope.notConnected = true;
		$scope.files = [];
		var selectedKey = null;
		var renaming = false;
		
		var setBusy = function(busy){
			$scope.busy = busy;
			
			$timeout(function(){
				$scope.$apply();
			}, 100);
		};
		
		var openFolder = function(path, callback) {
			if(!callback) callback = function(){};
			
			setBusy(true);
			path = path.slice(-1) == "/" ? path : path + "/";
			fileModel.readDir(path, function(err, data) {
				if (err) {
					console.log("Error:", err);
					callback(err);
				} else {
					fileModel.pwd = path;
					$scope.files = data;
					callback(null, data);
				}
				selectedKey = null;
				setBusy(false);
			});
		};

		var openFile = function(path, name, callback){
			if(!callback) callback = function(){};
			
			setBusy(true);

			path = path.slice(-1) == "/" ? path : path + "/";
			var openPath = path + name;

			fileModel.readFile(openPath, function(err, data) {
				if (err) {
					console.log("Error:", err);
					callback(err);
				} else {
					$rootScope.$emit("editor.openFile", path, name, data);
					$rootScope.$emit("rightInterface.switch", "editor");
					callback(null, data);
				}
				setBusy(false);
			});
		};

		var createNewFile = function(callback){
			if(!callback) callback = function(){};
			
			setBusy(true);

			fileModel.readDir(fileModel.pwd, function(err, data){
				if(err){
					setBusy(false);
					callback(err);
				}else{
					var name = "untitled";
					var tryName = name;
					var match = true;
					var k = 0;
					while(match){
						match = false;
						k++;
						for(var i = 0; i < data.length; i++){
							if(data[i].name == tryName){
								tryName = name + "_" + k;
								match = true;
								break;
							}
						}
					}
					name = tryName;
					fileModel.newFile(fileModel.pwd + name, function(err){
						callback(err, name);
						setBusy(false);
					});
				}
			});
		};

		var createNewFolder = function(callback){
			if(!callback) callback = function(){};
			
			setBusy(true);

			fileModel.readDir(fileModel.pwd, function(err, data){
				if(err){
					setBusy(false);
					callback(err);
				}else{
					var name = "untitled";
					var tryName = name;
					var match = true;
					var k = 0;
					while(match){
						match = false;
						k++;
						for(var i = 0; i < data.length; i++){
							if(data[i].name == tryName){
								tryName = name + "_" + k;
								match = true;
								break;
							}
						}
					}
					name = tryName;
					fileModel.newFolder(fileModel.pwd + name, function(err){
						callback(err, name);
						setBusy(false);
					});
				}
			});
		};
		
		$rootScope.$on("fileModel.onNewFile", function(scope, path){
			console.log("onNewFile:", path);
			openFolder(fileModel.pwd);
		});
		
		$scope.fileClick = function(key){
			for(var i = 0; i < $scope.files.length; i++){
				$scope.files[i].class = null;
			}
			
			selectedKey = key;
			$scope.files[selectedKey].class = "selected";
		};
		
		$scope.fileDblClick = function(key){
			selectedKey = key;
			if(!renaming)
				$scope.triggerOpen();
		};
		
		$scope.triggerUp = function(){
			
			analytics.log("sidebar-file", "up-folder");
			
			if(fileModel.pwd != "/"){
				var toks = fileModel.pwd.split("/");
				toks.pop();
				toks.pop();
				var path = toks.join("/") + "/";

				openFolder(path);
			}
		};

		$scope.triggerOpen = function() {
			
			analytics.log("sidebar-file", "open");
			
			var key = selectedKey;
			if(key !== null){
				var path = fileModel.pwd;
				var name =  $scope.files[key].name;
				if($scope.files[key].isFolder){
					openFolder(path + name);
				}else{
					openFile(path, name);
				}
			}
		};

		$scope.triggerNewFile = function(){
			
			analytics.log("sidebar-file", "new-file");
			
			setBusy(true);
			createNewFile(function(err, name){
				openFolder(fileModel.pwd, function(err){
					if(err){
						console.log("error:", err);
					}else{
						var key = null;
						for(var i = 0; i < $scope.files.length; i++){
							if($scope.files[i].name == name){
								key = i;
								break;
							}
						}
						$scope.fileClick(key);
						$scope.triggerRename();
						setBusy(false);
					}
				});
				
				
			});
		};

		$scope.triggerNewFolder = function() {
			
			analytics.log("sidebar-file", "new-folder");
			
			setBusy(true);
			createNewFolder(function(err, name){
				openFolder(fileModel.pwd, function(err, data){
					var key = null;
					for(var i = 0; i < $scope.files.length; i++){
						if($scope.files[i].name == name){
							key = i;
							break;
						}
					}
					$scope.fileClick(key);
					$scope.triggerRename();
					setBusy(false);
				});
			});
		};

		$scope.triggerDelete = function() {
			
			analytics.log("sidebar-file", "delete");
			
			setBusy(true);

			var path = fileModel.pwd + $scope.files[selectedKey].name;
			
			fileModel.unlink(path, function(err){
				if(err){
					console.log("error:", err);
					setBusy(false);
				}else{
					openFolder(fileModel.pwd, function(err, data){
						setBusy(false);
					});
				}
			});
		};
		
		$scope.submitRename = function(){
			setBusy(true);
			renaming = false;
			var newName = $scope.files[selectedKey].newName;
			var path = fileModel.pwd + $scope.files[selectedKey].name;
			var newPath = fileModel.pwd + $scope.files[selectedKey].newName;
			$scope.files[selectedKey].name = newName;
			$scope.files[selectedKey].rename = false;
			fileModel.move(path, newPath, function(err, data){
				if(err){
					console.log("error:", err);
					setBusy(false);
				}else{
					openFolder(fileModel.pwd, function(err, data){
						var key = null;
						for(var i = 0; i < $scope.files.length; i++){
							if($scope.files[i].name == newName){
								key = i;
								break;
							}
						}
						$scope.fileClick(key);
						setBusy(false);
					});
				}
			});
		};

		$scope.triggerRename = function() {
			
			analytics.log("sidebar-file", "rename");
			
			renaming = true;
			$scope.files[selectedKey].newName = $scope.files[selectedKey].name;
			$scope.files[selectedKey].rename = true;
		};

		$scope.triggerLink = function() {
			
			analytics.log("sidebar-file", "link");
			
			if (!fileModel.isAuthenticated()) {
				fileModel.signin();
			}
		};
		
		$scope.noThanksLink = function(){
			$scope.showLinkPopup = false;
		};

		$scope.triggerUnlink = function() {
			
			analytics.log("sidebar-file", "unlink");
			
			setBusy(true);
			if (fileModel.isAuthenticated()) {
				fileModel.signout();
				$scope.files = [];
				$scope.notConnected = true;
				setBusy(false);
			}
		};
		
		$scope.notConnected = fileModel.notConnected;
		
		$rootScope.$on("fileModel.notConnected", function(scope, notConnected){
			$scope.notConnected = notConnected;
			if(notConnected){
				// clear shit
			}else{
				setBusy(true);
				openFolder("/", function(err){
					setBusy(false);
				});
			}
		});
	}

    return ["$scope", "$rootScope", "FileModel", "UserData", "$timeout", "Analytics", FileSidebarController];
});
