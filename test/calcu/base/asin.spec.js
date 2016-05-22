define([
  "$J",
  "cali-calcu/base/asin",
  "../dev/Matchers"
], function ($J, asin, Matchers) {


  $J.describe("cali.module.base.asin", function () {
	
	// setup the environment
	var eps;
    $J.beforeEach(function () {
      $J.jasmine.Expectation.addMatchers(Matchers);
		eps = 1e-4;
	});

    $J.it("should computes the trigonometric asine of the input", function(){
		var inputs = [
			[[0]],
			[[0.5]],
			[[1]],
			[[-1]],
			[[0, 0.5, 1, -1]],
			[[0], [0.5], [1], [-1]],
			[[0, 0.5], [1, -1]],
		];
		var outputs = [
			[[0]],
			[[0.52360]],
			[[1.57080]],
			[[-1.57080]],
			[[0, 0.52360, 1.57080,-1.57080]],
			[[0], [0.52360],[ 1.57080],[-1.57080]],
			[[0, 0.52360], [1.57080,-1.57080]],
		];
		
		for(var i in inputs){
      $J.expect(asin(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
		}
	});
	
});

});