define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
  "async",
], function ($J, CommandParser, sinon, Matchers, base, async) {
	
	$J.describe("cali.module.base.plus", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the addition of the array input", function(){
			var inputs = [
			[ [[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6]] ],
			[ [[1, 2, 3], [4, 5, 6]], [[1]] ],
			[ [[1]], [[1, 2, 3], [4, 5, 6]] ]
			];
			var outputs = [
			[[2, 4, 6], [8, 10, 12]],
			[[2, 3, 4], [5, 6, 7]],
			[[2, 3, 4], [5, 6, 7]],
			];
		
			for(var i in inputs){
				$J.expect(base.plus(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	});
});