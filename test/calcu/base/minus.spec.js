define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/minus",
], function ($J, CommandParser, sinon, Matchers, minus) {
	
	$J.describe("cali.module.base.minus", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the subtraction of the array input", function(){
			var inputs = [
			[ [[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6]] ],
			[ [[1, 2, 4], [4, 6, 6]], [[1, 2, 3], [4, 5, 6]] ],
			[ [[1, 2, 3], [4, 5, 6]], [[1]] ],
			[ [[1]], [[1, 2, 3], [4, 5, 6]] ],
			];
			var outputs = [
			[[0, 0, 0], [0, 0, 0]],
			[[0, 0, 1], [0, 1, 0]],
			[[0, 1, 2], [3, 4, 5]],
			[[0, -1, -2], [-3, -4, -5]],
			];
		
			for(var i in inputs){
				$J.expect(minus(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	
	});
});