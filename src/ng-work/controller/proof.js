define([
], function(){


	function Controller($scope, $rootScope, $timeout, commandParser, notebookModel, HistoryView, outputService, pre, userData, analytics) {
		var self = this;
		$scope.active = false;
		
		var view = new HistoryView($("#proofInterface #page"));
		
		outputService.register("proof", this);
		
		$scope.save = function(){
			
		};
		
		$scope.print = function(){
			
		};
		
		$scope.publishedModal = false;
		$scope.errorModal = false;
		$scope.selectedNotebook = null;
		$scope.pageTitle = "";
		
		$scope.close = function(){
			$scope.publishedModal = false;
			$timeout(function(){
				$scope.active = false;
			}, 100);
		};
		
		$scope.closeModal = function(){
			$scope.errorModal = false;
		};
		
		$scope.publish = function(){
      $scope.errorMessage = "";
      if(!$scope.pageTitle){
        $scope.errorMessage = "Please enter a tile in the `Page Title` box.";
        $scope.errorModal = true;
        return ;
      }
			notebookModel.newPage($scope.selectedNotebook.notebook, $scope.pageTitle)
				.then(function(res){
					if(res.status == 200){
						return notebookModel.addPageItems($scope.selectedNotebook.notebook, res.data.page, self.model);
					}else{
						throw res.status;
					}
				})
				.then(function(res){
					$scope.pubLink = document.location.origin + "/" + userData.username + "/" + $scope.selectedNotebook.notebook + "/" + res.data.page;
					$scope.publishedModal = true;
				})
				.catch(function(ex){
					$scope.errorModal = true;
                    if (ex && ex.data){
                        $scope.errorMessage = ex.data;
                    }
				});
		};
		
		$scope.cancel = function(){
			$rootScope.$emit("history.active", true);
			$rootScope.$emit("proof.active", false);
			$scope.pageTitle = "";
			view.clear();
		};
		
		$scope.focus = function(){
			
		};
		
		$rootScope.$on("history.scrollBottom", function(){
			// view.scrollBottom();
		});
		
		$rootScope.$on("proof.active", function(scope, value){
			$scope.active = value;
			if(value){
				outputService.switch("proof");
			}
			
			notebookModel.findAll()
				.then(function(data){
					$scope.notebooks = data;
					$scope.selectedNotebook = data[0];
				});
		});
		
		$rootScope.$on("proof.start", function(scope, cmd){
			$rootScope.$emit("history.active", false);
			$rootScope.$emit("proof.active", true);
			self.model = [];
		});
		
		this.onCommand = function(cmd) {
			if (cmd && $scope.active) {
				self.push("command", cmd);
			}
		};

		this.onException = function(ex) {
			if (ex && $scope.active) {
				self.push("exception", ex);
			}
		};

		this.onResult = function(result, print) {
			if (print && result && $scope.active) {
				var value = pre.process("result", result);
				self.push("result", value);
			}
		};

		this.onComment = function(comment) {
			if (comment && $scope.active) {
				self.getLast(function(err, item){
					if(item && item.type == "comment"){
						self.updateLast("comment", item.data + comment);
					}else{
						self.push("comment", comment);
					}
				});
			}
		};

		this.createPlot = function(data, options, callback) {
			if (!callback) callback = function() {};
			
			self.push("plot", {data: data, options: options}, function(err, item){
				callback(null, item.id);
			});			
		};
		
		this.editPlot = function(id, data, options, callback){
			if (!callback) callback = function() {};
			
			self.updateId(id, "plot", {id: id, data: data, options: options}, function(err, item){
				callback(null, item.id);
			});	
		};
		
		var idNumber = 0;
		this.newId = function() {
			var out = "history-" + idNumber + "-" + (new Date()).getTime();
			idNumber++;
			return out;
		};
		
		this.model = [];
		this.push = function(type, value, callback) {
			if(!callback) callback = function(){};
			var item = {type: type, data: value, id: self.newId()};
			self.model.push(item);
			view.push(type, value, item.id);
			callback(null, item);
		};
		
		this.getLast = function(callback){
			if(!callback) callback = function(){};
			if(this.model.length > 0){
				callback(null, self.model[self.model.length - 1]);
			}else{
				callback(null, null);
			}
		};
		
		this.updateLast = function(type, value, callback){
			if(!callback) callback = function(){};
			self.model[self.model.length - 1].type = type;
			self.model[self.model.length - 1].data = value;
			view.updateLast(type, value);
			callback(null, self.model[self.model.length - 1]);
		};
		
		this.updateId = function(id, type, value, callback){
			if(!callback) callback = function(){};
			var k = null;
			for(var i = 0; i < self.model.length; i++){
				if(self.model[i].id == id){
					k = i;
					break;
				}
			}
			self.model[k].type = type;
			self.model[k].data = value;
			view.updateId(id, type, value);
			callback(null, self.model[k]);
		};
		
		this.activate = function() {
			$scope.active = true;
		};
		
		this.deactivate = function() {
			$scope.active = false;
		};
		
		commandParser.on("command", self.onCommand);
		commandParser.on("exception", self.onException);
		commandParser.on("result", self.onResult);
		commandParser.on("comment", self.onComment);
	}
		
    return ["$scope", "$rootScope", "$timeout", "CommandParser", "NotebookModel", "HistoryView", "OutputService", "PreRender", "UserData", "Analytics", Controller];

});