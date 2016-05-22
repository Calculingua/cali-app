define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/cov",
], function ($J, CommandParser, sinon, Matchers, cov) {
	
	$J.describe("cali.module.base.cov", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the cov of the input", function(){
			var inputs = [
				[ [[-1, 1, 2], [-2, 3, 1], [4, 0, 3]], , ],
				[ [[-1, 1, 2], [-2, 3, 1], [4, 0, 3]], [[1]], ],
				[ [[-1, 1, 2], [-2, 3, 1], [4, 0, 3]], [[2, 1, 3], [1, 3, 0], [-1, -2, 4]], ],
				[ [[-1, 1, 2], [-2, 3, 1], [4, 0, 3]], [[2, 1, 3], [1, 3, 0], [-1, -2, 4]], [[1]]],
			];
			var outputs = [
				[[10.3333,   -4.1667,    3.0000], [-4.1667,    2.3333,   -1.5000],[3.0000,   -1.5000,    1.0000]],
				[[ 6.8888888888888875, -2.7777777777777777, 2 ], [ -2.7777777777777777, 1.5555555555555556, -1 ], [ 2, -1, 0.6666666666666666 ]],
				[[3.94444, 0.8194], [0.8194, 3.9444]],
				[[3.5062, 0.7284], [0.7284, 3.5062]],
			];
		
			for(var i in inputs){
				$J.expect(cov(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	
	});
});