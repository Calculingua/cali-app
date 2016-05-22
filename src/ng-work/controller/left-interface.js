define([
], function(){

	function Controller($scope, $rootScope, analytics){
		$scope.views = {
			files: {label: "files", selected: false},
			notes: {label: "notes", selected: false},
			variable: {label: "variable", selected: true},
		};
		
		$scope.select = function(index){

			analytics.log("left-interface", "select", index);
			
			for(var i in $scope.views){
				if(i == index){
					$scope.views[i].selected = true;
					$scope.views[i].class = $scope.views[i].label + "-down";
				}else{
					$scope.views[i].selected = false;
					$scope.views[i].class = $scope.views[i].label + "-up";
				}
			}
		};
		
		$scope.select("variable");
		
		$rootScope.$on("leftInterface.select", function(scope, val){
			$scope.select(val);
			$scope.$apply();
		});
	}
	
    return ["$scope", "$rootScope", "Analytics", Controller];

});