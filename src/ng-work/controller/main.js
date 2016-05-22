define([
], function(){
	
	function Controller($scope, $timeout, walkThrough){
		
		$timeout(function(){
			walkThrough.start();
		}, 0);
		
	}
	
    return ["$scope", "$timeout", "WalkThrough", Controller];

});