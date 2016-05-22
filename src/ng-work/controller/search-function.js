define([
], function(){


  function Controller($scope, $rootScope, $timeout, $compile, SearchService, $sce, markdown, analytics){
		
		var actual = 50;
		var desired = 50;
		$scope.inFocus = false;
		$scope.showing = false;
		$scope.focus = function(){
			
			analytics.log("search-interface", "focus");
			
			$rootScope.$emit("rightInterface.setBottomHeight", 250);
			$scope.inFocus = true;
			$scope.showing = true;
		};
		
		$scope.hide = function(){
			analytics.log("search-interface", "hide");
			
			$rootScope.$emit("rightInterface.setBottomHeight", 50);
			$scope.inFocus = false;
			$scope.showing = false;
		};
		
        var commands = {
        	mean : {name : "mean", inputs: [{name : "A", required : true}, {name : "B"}], outputs: [{name: "ans"}]},
			min : {name : "min", inputs: [{name : "A"}, {name : "B"}], outputs: [{name: "ans"}]}
        };
		
		var labels = [];
		for(var key in commands){
			labels.push(key);
		}
		
		var clear = function(){
			$scope.searchText = "";
			$scope.command = null;
			$scope.$apply();
		};
		
		$scope.hideCommand = true;
		
		$scope.myOption = {
	        options: {
	            html: true,
	            focusOpen: false,
	            onlySelect: true,
	            source: function (request, response) {
                    console.log("MYOPTION", request, response);

                    data = SearchService.findTerm(request.term);
					
	                // data = $scope.myOption.methods.filter(labels, request.term);

	                if (!data.length) {
	                    data.push({
	                        label: 'not found',
	                        value: ''
	                    });
	                }
					
					$scope.command = null;
	                response(data);
	            }
	        },
	        methods: {},
			events: {
				select : function(event, ui){
                    $scope.command = ui.item;
                    $scope.command.html = $sce.trustAsHtml(markdown.toHTML(ui.item.mdHelp));
					console.log("SELECT event, ui:", event, ui);
					// $scope.command = commands[ui.item.label];
					console.log("command:", $scope.command);
					$scope.hideCommand = false;
				}
			}
	    };
		
		$scope.searchText = "";
		$scope.command = null;
		
		$scope.textChange = function(){
			// if($scope.searchText.length > 0){
// 				$scope.isActiveCommand = true;
// 			}else{
// 				$scope.isActiveCommand = false;
// 			}
		};
		
		$scope.$watch("command", function(){
			if($scope.command){
				$scope.isActiveCommand = true;
			}else{
				$scope.isActiveCommand = false;
			}
		});
		
		$scope.isActiveCommand = false;
		
		$scope.execute = function(error){
			
			analytics.log("search-interface", "execute");
			
			if(!error){
				var cmd = $scope.commandText();
				$rootScope.$emit("commandLine.executeCommand", cmd);
		
				$timeout(function(){
					$scope.inFocus = true;
					clear();
				}, 10);
			}
		};
		
		$scope.commandText = function(){
			var out = "";
			var cmd = $scope.command;
			if(!cmd){
				return "";
			}
			var i;
			
			var outputs = "";
			if(cmd.outputs[0].input){
				outputs += cmd.outputs[0].input;
			}
			
			if(outputs.length > 0 && cmd.outputs.length > 1){
				outputs = "[ " + outputs;
				
				for(i = 0; i < cmd.outputs.length; i++){
					outputs += ", ";
					if(cmd.outputs[i].input){
						outputs += cmd.outputs[i].input;
					}
				}
				
				outputs += " ]";
			}
			
			var inputs = "";
			if(cmd.inputs[0].input){
				inputs += "(";
				inputs += cmd.inputs[0].input;
				
				for(i = 0; i < cmd.inputs.length; i++){
					
				}
			}
			
			if(inputs.length > 0){
				inputs += ")";
			}
			
			out = (outputs.length > 0 ? outputs + " = " : "") + cmd.name + inputs;
			
			return out || "";
		};
	}
	
    return ["$scope", "$rootScope", "$timeout", "$compile", 'SearchService', '$sce', "Markdown", "Analytics", Controller];

});