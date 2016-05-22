define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/corrcoef",
], function ($J, CommandParser, sinon, Matchers, corrcoef) {

	$J.describe("cali.module.base.corrcoef", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the corrcoef of the input", function(){
			var inputs = [
				[ [[-1, 1, 2], [-2, 3, 1], [4, 0, 3], [1, 1, 2]], , ],
				[ [[-1, 1, 2], [-2, 3, 1], [4, 0, 3], [1, 1, 2]], [[-1, 1, 2], [-2, 3, 1], [4, 0, 3], [1, 1, 2]], ],
			];
			var outputs = [
				[[ 1, -0.85106449634699, 0.9258200997725515 ], [ -0.85106449634699, 1, -0.9733285267845754 ], [ 0.9258200997725515, -0.9733285267845754, 1 ]],
				[[ 1, 1 ], [ 1, 1 ]],
			];
		
			for(var i in inputs){
				$J.expect(corrcoef(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	});
});