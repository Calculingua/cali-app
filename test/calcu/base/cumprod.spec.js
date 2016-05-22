define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
  "async",
], function ($J, CommandParser, sinon, Matchers, base, async) {

	$J.describe("cali.module.base.cumprod", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			cumprod = base.cumprod;
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the cumprod of the array input", function(){
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
				[[0.5, .1, .03, .03]],
				[[0.5], [.1], [.03], [.03]],
				[[0.5, .2, .3, 1], [.25, .04, .09, 1], [.125, .008, .027, 1]],
				[[0.5, .2, .3, 1], [.25, .04, .09, 1], [.125, .008, .027, 1]],
				[[0.5, .1, .03, .03], [0.5, .1, .03, .03],[0.5, .1, .03, .03]]
			];
		
			for(var i in inputs){
				if(typeof inputs[i][1] === "undefined"){
					$J.expect(cumprod(inputs[i][0])).toBeMatrixCloseTo(outputs[i], eps);
				}
				else{
					$J.expect(cumprod(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
				}
			}
		});
	});
});