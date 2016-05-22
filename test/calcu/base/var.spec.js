define([
  "cali-calcu/base/var",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (func, $J, CommandParser, Matchers) {

describe("cali.module.base.var", function(){
	
	// setup the environment
	var parser = null;
	var eps;
	beforeEach(function() {
		parser = new CommandParser();
		$J.jasmine.Expectation.addMatchers(Matchers);
		eps = 1e-4;
	});
	
	it("should computes the var of the input", function(){
		var inputs = [
			[ [[1], [7]], , ],
			[ [[1, 5, 9], [7, 15, 22]], , ],
			[ [[1, 5, 9], [7, 15, 22]], ,1 ],
			[ [[1, 5, 9], [7, 15, 22]], 0,1 ],
			[ [[1, 5, 9], [7, 15, 22]], ,2 ],
			[ [[1, 5, 9], [7, 15, 22]], 1 ,2 ], 
		];
		var outputs = [
			[[18]],
			[[18, 50, 84.5]],
			[[18, 50, 84.5]],
			[[18, 50, 84.5]],
			[[16.0], [56.3333333]],
			[[10.66667], [37.55557]],
		];
		
		for(var i in inputs){
			expect(func(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
		}
	});
	
});
});