define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
  "async",
], function ($J, CommandParser, sinon, Matchers, base, async) {

	$J.describe("cali.module.base.cumsum", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			cumsum = base.cumsum;
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the cumsum of the array input", function(){
			var inputs = [
				[ [[]], ],
				[[[0.5, .2, .3, 1]],],
				[[[0.5], [.2], [.3], [1]],],
				[[[0.5, .2, .3, 1], [0.5, .2, .3, 1], [0.5, .2, .3, 1]],],
				[[[0.5, .2, .3, 1], [0.5, .2, .3, 1], [0.5, .2, .3, 1]], 1],
				[[[0.5, .2, .3, 1], [0.5, .2, .3, 1], [0.5, .2, .3, 1]], 2],
			];
			var outputs = [
				[[0]],
				[[0.5, .7, 1, 2]],
				[[0.5], [.7], [1], [2]],
				[[0.5, .2, .3, 1], [1, .4, .6, 2], [1.5, .6, .9, 3]],
				[[0.5, .2, .3, 1], [1, .4, .6, 2], [1.5, .6, .9, 3]],
				[[0.5, .7, 1, 2], [0.5, .7, 1, 2],[0.5, .7, 1, 2]]
			];
		
			for(var i in inputs){
				if(typeof inputs[i][1] === "undefined"){
					$J.expect(cumsum(inputs[i][0])).toBeMatrixCloseTo(outputs[i], eps);
				}
				else{
					$J.expect(cumsum(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
				}
			}
		});
	});
});