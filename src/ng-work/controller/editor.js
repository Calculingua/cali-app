define([
], function(){

	function EditorController($scope, $rootScope, $timeout, editorView, fileModel, commandParser, analytics) {
		var self = this;
		this.selected = null;
		this.contents = "";
		$scope.changed = false;
		$scope.syncing = false;
		
		var setChanged = function(val){
			$scope.changed = val;
			$timeout(function(){
				$scope.$apply();
			});
			
		};
		
		var setSyncing = function(val){
			$scope.syncing = val;
			$timeout(function(){
				$scope.$apply();
			});
		};
		
		this.dtSync = 10000;
		this.syncInterval = setInterval(function(){
			if($scope.changed && self.selected){
				self.saveSelected(function(err){
					if(err) console.log("problem saving selected");
				});
			}
		}, this.dtSync);

		$rootScope.$on("editorView.onChange", function(){
			self.selected = editorView.getSelectedPath();
			if(self.selected){
				setChanged(true);
				self.contents = editorView.getSelected().getValue();
			}
		});

		$rootScope.$on("editorView.onBeforeSelectionChange", function(scope, oldPath){
			if($scope.changed && self.selected){
				setSyncing(true);
				setChanged(false);
				fileModel.saveFile(self.selected, self.contents, function(err) {
					setSyncing(false);
				});
			}
		});
		
		$rootScope.$on("editorView.onSelectionChange", function(){
			self.selected = editorView.getSelectedPath();
			self.contents = editorView.getSelected().getValue();
		});
		
		$rootScope.$on("fileModel.onMove", function(scope, path, newPath){
			var name = newPath.split("/").pop();
			editorView.renameTab(path, newPath, name);
		});

		$rootScope.$on("editor.openFile", function(scope, path, name, contents){
			analytics.log("editor", "open");
			editorView.insertNewFile(path + name, name, contents);
		});
		
		$rootScope.$on("editor.removeTab", function(scope, path){
			if(path == self.selected && $scope.changed){
				saveSelected(function(err){
					editorView.removeTab(path);
				});
			}else{
				editorView.removeTab(path);
			}
		});
		
		$scope.run = function(){
			analytics.log("editor", "run");
			var cmd = editorView.getSelected().getValue();
			$rootScope.$emit("rightInterface.switch", "history");
			commandParser.evaluate(cmd, function(){
				$rootScope.$emit("history.scrollBottom");
			});
		};

		$scope.addNewFile = function(callback) {
			
			analytics.log("editor", "new");
			if(!callback) callback = function(){};
			var path = fileModel.pwd;

			fileModel.readDir(path, function(err, data){
				if(err){
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
					fileModel.newFile(path + name, function(err){
						if(err){
							callback(err);
						}else{
							editorView.insertNewFile(path + name, name, "");
							callback(null, path, name);
						}
					});
				}
			});
		};

		$scope.proof = function(){
			analytics.log("editor", "proof");
			var cmd = editorView.getSelected().getValue();
			$rootScope.$emit("proof.start", cmd);
			commandParser.evaluate(cmd, function(){
			});
		};
	
		this.saveSelected = function(callback){
			if(!callback)callback = function(){};
			try {
				setSyncing(true);
				var path = editorView.getSelectedPath();
				var data = editorView.getSelected().getValue();
				setChanged(false);
				fileModel.saveFile(path, data, function(err) {
					setSyncing(false);
					callback(null);
				});
			} catch (ex) {
				setSyncing(false);
				return callback(ex);
			}
		};
	}

    return ["$scope", "$rootScope", "$timeout", "EditorView", "FileModel", "CommandParser", "Analytics", EditorController];

});
