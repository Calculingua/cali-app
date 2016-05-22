define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/mtimes"
], function ($J, CommandParser, Matchers, mtimes) {
	
	$J.describe("cali.module.base.mtimes", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the multiplication of the matrix input", function(){
			var inputs = [
    			[ [[1, 3, 5], [2, 4, 7]], [[-5, 8, 11], [3, 9, 21], [4, 0, 8]] ],
    			[ [[1, 2, 3], [4, 5, 6]], [[2]] ],
    			[ [[2]], [[1, 2, 3], [4, 5, 6]] ]
			];
			var outputs = [
    			[[24, 35, 114], [30, 52, 162]],
    			[[2, 4, 6], [8, 10, 12]],
    			[[2, 4, 6], [8, 10, 12]],
			];
		
			for(var i in inputs){
				$J.expect(mtimes(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
			}
		});
        
		$J.it("should throw an error when matrices can't be multiplied", function(){
			var inputs = [
    			[ [[1, 3, 5], [2, 4, 7]], [[-5, 8, 10, 11], [3, 9, 12, 15]] ],
    			[ [[1, 2, 3]], [[2, 3, 4]] ],
    			[ [[2], [3], [4]], [[1], [2], [3]] ],
                [ [[2], [3], [4]], [[1, 3, 4], [2, 4, 6], [3, 7, 8]] ],
                [ [[1, 2, 3]], [[2, 3, 4], [2, 3, 4], [2, 3, 4], [2, 3, 4]] ],
			];
			var errors = [
			    "Operation Error : MULTIPLICATION : matrices cannot be multiplied because they have the wrong dimensions.",
                "Operation Error : MULTIPLICATION : matrices cannot be multiplied because they have the wrong dimensions.",
                "Operation Error : MULTIPLICATION : matrices cannot be multiplied because they have the wrong dimensions.",
                "Operation Error : MULTIPLICATION : matrices cannot be multiplied because they have the wrong dimensions.",
                "Operation Error : MULTIPLICATION : matrices cannot be multiplied because they have the wrong dimensions.",
			];
		
			for(var i in inputs){
				$J.expect(function(){
                    mtimes(inputs[i][0], inputs[i][1]);
                }).toThrow(errors[i]);
			}
		});
	});
});