define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
], function ($J, CommandParser, sinon, Matchers, base) {

	$J.describe("cali.module.base.cos", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			cos = base.cos;
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the trigonometric sine of the input", function(){
			var inputs = [
				[[0]],
				[[0.5]],
				[[3.142]],
				[[5]],
				[[0, 0.5, 3.142, 5]],
				[[0], [0.5], [3.142], [5]],
				[[0, 0.5], [3.142, 5]],
			];
			var outputs = [
				[[1]],
				[[0.877582]],
				[[-1]],
				[[0.28366]],
				[[1, 0.877582, -1,0.28366]],
				[[1], [0.877582],[ -1],[0.28366]],
				[[1, 0.877582], [-1,0.28366]],
			];
		
			for(var i in inputs){
				$J.expect(cos(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	
	});
});