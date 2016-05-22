define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/reshape",
], function ($J, CommandParser, sinon, Matchers, reshape) {

	$J.describe("cali.module.base.reshape", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the reshape product of the input", function(){
			var inputs = [
				[ [[1, 2, 3], [9, 8, 7]], [[1]], [[6]] ],
				[ [[1, 2, 3], [9, 8, 7]], [[1]], [[]] ],
				[ [[1, 2, 3], [9, 8, 7]], [[]], [[1]] ],
				[ [[1, 2, 3], [9, 8, 7]], [[3]], [[]] ],
				[ [[1, 2, 3], [9, 8, 7]], [[3, 2]],  ],
			];
			var outputs = [
				[[1, 9, 2, 8, 3, 7]],
				[[1, 9, 2, 8, 3, 7]],
				[[1], [9], [2], [8], [3], [7]],
				[[1, 8], [9, 3], [2, 7]],
				[[1, 8], [9, 3], [2, 7]],
			];
		
			for(var i in inputs){
				$J.expect(reshape(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
	
		$J.it("should throw an error when the dimensions are mismatched", function(){
			var inputs = [
				[ [[1, 2, 3], [9, 8, 7]], [[1]], [[5]] ],
				[ [[1, 2, 3], [9, 8, 7]], [[1]], [[7]] ],
				[ [[1, 2, 3], [9, 8, 7]], [[2]], [[1]] ],
			];
		
			for(var i in inputs){
				try{
					reshape(inputs[i][0], inputs[i][1], inputs[i][2]);
					$J.expect(false).toEqual(true);
				}catch(ex){
					$J.expect(ex).toEqual("Error with reshape: dimension mismatch");
				}
			}
		});
	
	});
});