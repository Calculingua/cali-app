define([
], function(){

	function Controller($scope, $rootScope, variableModel, analytics){
		
		$scope.variables = variableModel.variables;
				
		var selectedKey = null;
		
		$scope.variableClick = function(key){
			
			analytics.log("sidebar-variable", "click");
			
			selectedKey = key;
			
			for(var k in $scope.variables){
				$scope.variables[k].class = null;
			}
			
			$scope.variables[selectedKey].class = "selected";
		};
		
		$scope.deleteVariable = function(){
			
			analytics.log("sidebar-variable", "delete");
			
			variableModel.deleteVariable(selectedKey, function(err){
				selectedKey = null;
			});
		};
				
		$scope.variableDblClick = function(key){
			
			analytics.log("sidebar-variable", "double-click");

		};
		
		$rootScope.$on("variableModel.onChange", function(){
            //#237: attaching this view information  (typeName, typeClass) causes it to propagate to the server and the worker.
            //(this is an unhappy side-effect of angular double-binding and treating business objects as data).
			for(var key in $scope.variables){
				switch($scope.variables[key].type){
				case "TABLE":
					$scope.variables[key].typeClass = "icon-table";
					$scope.variables[key].info = "" + $scope.variables[key].data[0].length + " x " + $scope.variables[key].data.length;
                    $scope.variables[key].typeName = "Table";
					break;
				case "HANDLE":
					$scope.variables[key].typeClass = "icon-bar-chart";
					$scope.variables[key].info = "Figure";
                    $scope.variables[key].typeName = "";
					break;
				case "HASH_TABLE":
					$scope.variables[key].typeClass = "icon-table";
					var cnt = 0;
					for(var kkey in $scope.variables[key].data){
						cnt++;
					}
					$scope.variables[key].info = cnt.toString() + " prop";
                    $scope.variables[key].typeName = "Object";
					break;
				case "CATEGORICAL":
					$scope.variables[key].typeClass = "icon-th";
					$scope.variables[key].info = "" + $scope.variables[key].data.length + " x " + $scope.variables[key].data[0].length;
                    $scope.variables[key].typeName = "Categorical";
					break;
                case "LINEARMODEL":
                    $scope.variables[key].typeClass = "icon-th";
                    $scope.variables[key].info =  $scope.variables[key].shortDisplay();
                    $scope.variables[key].typeName = "LinearModel";
                    break;
				default:
					$scope.variables[key].typeClass = "icon-th";

                    if ($scope.variables[key][0] && typeof $scope.variables[key][0].length === "number") {
                        $scope.variables[key].info = "" + $scope.variables[key].length + " x " + $scope.variables[key][0].length;
                    } else {
                        $scope.variables[key].info = "";
                    }


                    $scope.variables[key].typeName = "Matrix";

					break;
				}
			}
		});
		
	}
	
    return ["$scope", "$rootScope", "VariableModel", "Analytics", Controller];

});