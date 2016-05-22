define([
], function(){
	
	function HistoryController($scope, $rootScope, commandParser, pageModel, HistoryView, outputService, pre, analytics) {
		var self = this;
		this.active = true;
		
		var view = new HistoryView($("#historyInterface"));
		
		outputService.register("history", this);
		
		$scope.save = function(){
			
		};
		
		$scope.print = function(){
			
		};
		
		$scope.focus = function(){
			// $rootScope.$emit("rightInterface.setBottomHeight", 50);
			$rootScope.$emit("commandLine.focus");
			view.scrollBottom();
		};
		
		$rootScope.$on("history.active", function(scope, value){
			self.active = value;
			if(value){
				outputService.switch("history");
			}
		});
		
		$rootScope.$on("history.scrollBottom", function(){
			view.scrollBottom();
		});
		
		this.onCommand = function(cmd) {
			if (cmd && self.active) {
				self.push("command", cmd);
			}
		};

		this.onException = function(ex) {
			if (ex && self.active) {
				self.push("exception", ex);
			}
		};

		this.onResult = function(result, print) {
			if (print && result && self.active) {
				var value = pre.process("result", result);
				self.push("result", value);
			}
		};

		this.onComment = function(comment) {
			if (comment && self.active) {
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
			self.active = true;
		};
		
		this.deactivate = function() {
			self.active = false;
		};
		
		commandParser.on("command", self.onCommand);
		commandParser.on("exception", self.onException);
		commandParser.on("result", self.onResult);
		commandParser.on("comment", self.onComment);
	}
		
    return ["$scope", "$rootScope", "CommandParser", "ScratchPageModel", "HistoryView", "OutputService", "PreRender", "Analytics", HistoryController];

});