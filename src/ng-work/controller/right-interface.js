define([
], function(){


  function Controller($scope, $rootScope, $interval, $timeout, analytics){
		
		$scope.icons = {editor : false, history : true};
		
		$scope.switch = function(val){
			
			analytics.log("right-interface", "select", val);
			
			for(var key in $scope.icons){
				if(key == val){
					$scope.icons[key] = true;
				}else{
					$scope.icons[key] = false;
				}
			}
		};
		
		$scope.bottomHeight = 50;
		var targetHeight = 50;
		var int = null;
		
		var move = function(targetHeight){
			
			var up = targetHeight > $scope.bottomHeight ? true : false;
			$interval.cancel(int);
			
			int = $interval(function(){
				if(up){
					if($scope.bottomHeight < targetHeight){
						$scope.bottomHeight += 25;
					}else{
						$scope.bottomHeight = targetHeight;
						$interval.cancel(int);
					}
				}else{
					if($scope.bottomHeight > targetHeight){
						$scope.bottomHeight -= 25;
					}else{
						$scope.bottomHeight = targetHeight;
						$interval.cancel(int);
					}
				}
				$scope.$apply();
			}, 10);
		};
		
		$rootScope.$on("rightInterface.switch", function(scope, val){
			$scope.switch(val);
			
			$timeout(function(){
				$scope.$apply();
			}, 0);
			
		});
		
		$rootScope.$on("rightInterface.setBottomHeight", function(scope, height){
			move(height);
		});
		
		
	}
	
    return ["$scope", "$rootScope", "$interval", "$timeout", "Analytics", Controller];

});