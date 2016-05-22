define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/mean",
], function ($J, CommandParser, sinon, Matchers, mean) {

	$J.describe("cali.module.base.mean", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the mean product of the input", function(){
			var inputs = [
				[ [[0], [2], [1], [4]], ],
				[ [[0, 2, 1, 4]], ],
				[ [[0, 1, 1], [2, 3, 2], [1, 3, 2], [4, 2, 2]], ],
				[ [[0, 1, 1], [2, 3, 2], [1, 3, 2], [4, 2, 2]], 1],
				[ [[0, 1, 1], [2, 3, 2], [1, 3, 2], [4, 2, 2]], 2],
			];
			var outputs = [
				[[1.75]],
				[[1.75]],
				[[1.75, 2.25, 1.75]],
				[[1.75, 2.25, 1.75]],
				[[2/3], [7/3], [2], [8/3]]
			];
		
			for(var i in inputs){
				if(typeof inputs[i][2] === "undefined"){
					$J.expect(mean(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
				}else{
					$J.expect(mean(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
				}
			
			}
		});
	
	});
});