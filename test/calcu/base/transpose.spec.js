define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/transpose",
], function ($J, CommandParser, sinon, Matchers, transpose) {

	describe("cali.module.base.transpose", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the element-wise transpose of the array input", function(){
			var inputs = [
			[ [[1, 2, 3], [4, 5, 6]] ],
			];
			var outputs = [
			[[1, 4], [2, 5], [3, 6]],
			];
		
			for(var i in inputs){
				$J.expect(transpose(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	
	});
});