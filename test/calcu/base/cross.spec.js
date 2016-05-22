define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
], function ($J, CommandParser, sinon, Matchers, base) {
	
	$J.describe("cali.module.base.cross", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			cross = base.cross;
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the cross product of the input", function(){
			var inputs = [
			[ [[1, 2, 3]], [[4, 5, 6]] ],
			[ [[1], [2], [3]], [[4], [5], [6]] ],
			[ [[1], [2], [3]], [[4, 5, 6]] ],
			[ [[1, 2, 3]], [[4], [5], [6]] ],
			[ [[1, 2, 3], [4, 5, 6]], [[4, 5, 6], [1, 2, 3]]],
			[ [[1, 4], [2, 5], [3, 6]], [[4, 1], [5, 2], [6, 3]] ],
			[ [[1, 2, 3]], [[4, 5, 6], [1, 2, 3]]],
			[ [[1], [2], [3]], [[4, 1], [5, 2], [6, 3]]],
			[ [[1], [2], [3]], [[4, 5, 6], [1, 2, 3]]],
			[ [[1, 2, 3], [4, 5, 6]], [[1, 2, 3]]],
			[ [[1, 4, 1], [2, 5, 2], [3, 6, 3]], [[4, 1, 1], [5, 2, 2], [6, 3, 3]]],
			[ [[1, 2, 3], [4, 5, 6], [1, 2, 3]], [[4, 5, 6], [1, 2, 3], [1, 2, 3]], 2],
			[ [[1, 4, 1], [2, 5, 2], [3, 6, 3]], [[4, 1, 1], [5, 2, 2], [6, 3, 3]], 1],
		
			];
			var outputs = [
				[[-3, 6, -3]],
				[[-3], [6], [-3]],
				[[-3, 6, -3]],
				[[-3, 6, -3]],
				[[-3, 6, -3], [3, -6, 3]],
				[[-3, 3], [6, -6], [-3, 3]],
				[[-3, 6, -3], [0, 0, 0]],
				[[-3,0], [6, 0], [-3, 0]],
				[[-3, 6, -3], [0, 0, 0]],
				[[0, 0, 0], [3, -6, 3]],
				[[-3, 3, 0], [6, -6, 0], [-3, 3, 0]],
				[[-3, 6, -3], [3, -6, 3], [0, 0, 0]],
				[[-3, 3, 0], [6, -6, 0], [-3, 3, 0]],
			];
		
			for(var i in inputs){
				if(typeof inputs[i][2] === "undefined"){
					$J.expect(cross(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
				}else{
					$J.expect(cross(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
				}
			
			}
		});
	
	});
});