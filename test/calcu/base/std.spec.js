define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/std"
], function ($J, CommandParser, Matchers, std) {

describe("cali.module.base.std", function(){
	
	// setup the environment
	var parser = null;
	var eye = null;
	var eps;
	beforeEach(function() {
		parser = new CommandParser();
		$J.jasmine.Expectation.addMatchers(Matchers);
		eps = 1e-4;
	});
	
	it("should computes the std of the input", function(){
		var inputs = [
			[ [[1], [7]], , ],
			[ [[1, 5, 9], [7, 15, 22]], , ],
			[ [[1, 5, 9], [7, 15, 22]], ,1 ],
			[ [[1, 5, 9], [7, 15, 22]], ,2 ],
			[ [[1, 5, 9], [7, 15, 22]], 1 ,2 ], 
		];
		var outputs = [
			[[4.2426]],
			[[4.2426, 7.0711, 9.1924]],
			[[4.2426, 7.0711, 9.1924]],
			[[4.0], [7.5056]],
			[[3.26599], [6.12826]],
		];
		
		for(var i in inputs){
			expect(std(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
		}
	});
	
});
});