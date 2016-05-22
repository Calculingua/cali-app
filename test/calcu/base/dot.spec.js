define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions"
], function ($J, CommandParser, Matchers, base) {
	
	$J.describe("cali.module.base.dot", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			dot = base.dot;
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.it("should computes the dot product of the input", function(){
			var inputs = [
			[ [[1, 2, 3]], [[9, 8, 7]] ],
			[ [[1], [2], [3]], [[9], [8], [7]] ],
			[ [[1], [2], [3]], [[9, 8, 7]] ],
			[ [[1, 2, 3]], [[9], [8], [7]] ],
			[ [[1, 2], [4, 5],[7, 8]],[[9, 8], [6, 5],[3, 2]], ],
			[ [[1, 4, 7], [2, 5, 8]], [[9, 6, 3], [8, 5, 2]], ],
			[ [[1, 4, 7], [2, 5, 8]], [[9, 8], [6, 5],[3, 2]], ],
			[ [[1, 2], [4, 5],[7, 8]], [[9, 6, 3], [8, 5, 2]], ],
			[ [[1, 2, 3], [4, 5, 6],[7, 8, 9]],[[9, 8, 7], [6, 5, 4],[3, 2, 1]], ],
			[ [[1, 2, 3], [4, 5, 6],[7, 8, 9]],[[9, 8, 7], [6, 5, 4],[3, 2, 1]], 1],
			[ [[1, 2, 3], [4, 5, 6],[7, 8, 9]],[[9, 8, 7], [6, 5, 4],[3, 2, 1]], 2],
			];
			var outputs = [
				[[46]],
				[[46]],
				[[46]],
				[[46]],
				[[54, 57]],
				[[54], [57]],
				[[54, 57]],
				[[54, 57]],
				[[54, 57, 54]],
				[[54, 57, 54]],
				[[46], [73], [46]],
			];
		
			for(var i in inputs){
				if(typeof inputs[i][2] === "undefined"){
					$J.expect(dot(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
				}else{
					$J.expect(dot(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
				}
			}
		});
	});
});