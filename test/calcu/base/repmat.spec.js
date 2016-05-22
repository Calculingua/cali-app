define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/repmat",
], function ($J, CommandParser, sinon, Matchers, repmat) {

	$J.describe("cali.module.base.repmat", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
	        $J.jasmine.Expectation.addMatchers(Matchers);
	        eps = 1e-4;
		});
	
		$J.it("should computes the repmat product of the input", function(){
			var inputs = [
				[ [[1, 2], [9, 8]], [[2]], ],
				[ [[1, 2], [9, 8]], [[2]], [[2]] ],
				[ [[1, 2], [9, 8]], [[2]], [[1]] ],
				[ [[1, 2], [9, 8]], [[1]], [[2]] ],
				[ [[1, 2], [9, 8]], [[1, 2]], ],
				[ [[1, 2]], [[4, 1]], ],
			];
			var outputs = [
				[[1, 2, 1, 2], [9, 8, 9, 8], [1, 2, 1, 2], [9, 8, 9, 8]],
				[[1, 2, 1, 2], [9, 8, 9, 8], [1, 2, 1, 2], [9, 8, 9, 8]],
				[[1, 2], [9, 8], [1, 2], [9, 8]],
				[[1, 2, 1, 2], [9, 8, 9, 8]],
				[[1, 2, 1, 2], [9, 8, 9, 8]],
				[[1, 2],[1, 2], [1, 2], [1, 2] ],
			];
		
			for(var i in inputs){
				$J.expect(repmat(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	});
});