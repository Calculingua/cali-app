define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/diff"
], function ($J, CommandParser, Matchers, diff) {
	
	$J.describe("cali.module.base.diff", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the diff of the array input", function(){
			var inputs = [
				[ [[1, 1, 1, 1]], , ],
				[ [[1], [1], [1], [1]], , ],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6]], , ],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6]], [[2]], ],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6], [2, 2, 3, 1]], [[1]], ],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6], [2, 2, 3, 1]], [[2]], ],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6], [2, 2, 3, 1]], [[3]], ],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6], [2, 2, 3, 1]], [[1]], [[1]]],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6], [2, 2, 3, 1]], [[1]], [[2]]],
				[ [[1, 1, 1, 1], [2, 2, 2, 2], [5, 5, 5, 6], [2, 2, 3, 1]], [[2]], [[2]]],
			];
			var outputs = [
				[[0, 0, 0]],
				[[0], [0], [0]],
				[[1, 1, 1, 1], [3, 3, 3, 4]],
				[[2, 2, 2, 3]],
				[[1, 1, 1, 1], [3, 3, 3, 4], [-3, -3, -2, -5]],
				[[2, 2, 2, 3], [-6, -6, -5, -9]],
				[[-8, -8, -7, -12]],
				[[1, 1, 1, 1], [3, 3, 3, 4], [-3, -3, -2, -5]],
				[[0, 0, 0], [0, 0, 0], [0, 0, 1], [0, 1, -2]],
				[[0, 0], [0, 0], [0, 1], [1, -3]],
			];
		
			for(var i in inputs){
				$J.expect(diff(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	
	});
});