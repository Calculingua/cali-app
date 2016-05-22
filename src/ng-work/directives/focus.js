define([
], function(){

	function Directive($timeout) {
		var out = {
			scope: { trigger: '=focusMe' },
			link: function(scope, element) {
				scope.$watch('trigger', function(value) {
					if(value === true) { 
						$timeout(function(){
							element[0].focus();
							scope.trigger = false;
						});
					}
				});
			}
		};
		return out;
	}
	
    return ["$timeout", Directive];

});
