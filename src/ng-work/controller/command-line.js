define([
], function () {

	function Controller($scope, $timeout, $rootScope, historyModel, commandParser, analytics){
			
		$scope.busy = false;
		$scope.focus = false;
		
		var execute = function(callback){
			if(!callback) callback = function(){};
			
			itemi = 0;
			var command = $scope.commandText;
			
			if(command){
				analytics.log("command-line", "execute", command);
				
				commandParser.evaluate(command, function(error, ans) {
					var stored = ans;
					if (error) {
						analytics.log("command-line", "error", error.toString());
						stored = error;
					}

					$rootScope.$emit("rightInterface.switch", "history");
					historyModel.insertItem(command, stored, function(item){
						$timeout(function(){
							callback();
						}, 0);
					});
				});
			}else{
				callback();
			}
		};
		
		var itemi = 0;
		$scope.up = function(){
			analytics.log("command-line", "key-up");
			
			if(historyModel.items.length > 0){
				$scope.commandText = historyModel.items[itemi].command;
				itemi++;
				if(itemi >= historyModel.items.length) itemi = historyModel.items.length - 1;
			}
			
		};
		
		$scope.down = function(){
			analytics.log("command-line", "key-down");
			itemi--;
			$scope.commandText = itemi >= 0 ? historyModel.items[itemi].command : "";
			if(itemi <= 0){
				itemi = 0;
			}
		};
		
		$scope.submit = function(){
			$scope.busy = true;
			execute(function(){
				$scope.busy = false;
				$scope.commandText = "";
				$scope.focus = true;
                $rootScope.$emit("history.scrollBottom");
			});
		};
		
		$rootScope.$on("commandLine.focus", function(){
			$scope.focus = true;
		});
		
		$rootScope.$on("commandLine.executeCommand", function(scope, cmd){
			$rootScope.$emit("history.scrollBottom");
			$scope.commandText = cmd;
			$scope.busy = true;
			$timeout(function(){
				execute(function(){
					$scope.busy = false;
					$scope.commandText = "";
				});
			}, 50);
		});
		
		$scope.stop = function(){
			commandParser.cancelEvaluation("user interaction");
			$scope.busy = false;
		};
		
		var close = function(callback) {
			commandParser.stop();
			callback(null);
		};
	}
	
	
    return ["$scope", "$timeout", "$rootScope", "HistoryModel", "CommandParser", "Analytics", Controller];
});
