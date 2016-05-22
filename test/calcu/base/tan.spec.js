define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/tan"
], function ($J, CommandParser, Matchers, tan) {

describe("cali.module.base.tan", function(){
	
	// setup the environment
	var parser = null;
	var eps;
	beforeEach(function() {
		parser = new CommandParser();
		$J.jasmine.Expectation.addMatchers(Matchers);
		eps = 1e-5;
	});
	
	it("should computes the trigonometric tangent of the input", function(){
		var inputs = [
			[[0.0]],
			[[0.5]],
			[[3.14159]],
			[[5]],
			[[0, 0.5, 3.14159, 5]],
			[[0], [0.5], [3.14159], [5]],
			[[0, 0.5], [3.14159, 5]],
		];
		var outputs = [
			[[0]],
			[[0.546302]],
			[[0]],
			[[-3.38052]],
			[[0, 0.546302, 0, -3.38052]],
			[[0], [0.546302],[ 0],[-3.38052]],
			[[0, 0.546302], [0,-3.38052]],
		];
		
		for(var i in inputs){
			expect(tan(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
		}
	});
	
});
});