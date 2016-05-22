describe("cali.module.base.times", function(){
	
	// setup the environment
	var parser = null;
	var eps;
	beforeEach(function() {
		parser = new cali.calcu.CommandParser();
		jasmine.Expectation.addMatchers(cali.spec.Matchers);
		eps = 1e-4;
	});
	
	it("should computes the element-wise multiplication of the array input", function(){
		var inputs = [
		[ [[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6]] ],
		[ [[1, 2, 3], [4, 5, 6]], [[1]] ],
		[ [[1]], [[1, 2, 3], [4, 5, 6]] ]
		];
		var outputs = [
		[[1, 4, 9], [16, 25, 36]],
		[[1, 2, 3], [4, 5, 6]],
		[[1, 2, 3], [4, 5, 6]],
		];
		
		for(var i in inputs){
			expect(cali.module.base.times(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
		}
	});
	
});