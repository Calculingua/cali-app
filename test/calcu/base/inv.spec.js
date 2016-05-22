define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions"
], function ($J, CommandParser, Matchers, base) {
	
	$J.describe("cali.module.base.inv(n, m)", function() {

		// setup the environment
		var parser = null;
		var inv = null;
	    var eps = null;
		$J.beforeEach(function() {
			parser = new CommandParser();
			inv = base.inv;
      eps = 1e-4;
      $J.jasmine.Expectation.addMatchers(Matchers);
		});

		$J.describe("inverts a matrix", function() {

			$J.it("should return a 2x2", function() {
	            inputs = [
	                [[1,0], [0,1]],
	                [[4,7], [2,6]],
	                [[1,2,3], [0,1,4], [5,6,0]],
	            ];
	            outputs = [
	                [[1,0], [0,1]],
	                [[0.6, -0.7], [-0.2, 0.4]],
	                [[-24,18,5], [20,-15,-4], [-5,4,1]]
	            ]

	            for(var i in inputs){
	                $J.expect(inv(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
	            }

				// var out = inv(A);
				// expect(out).toEqual(A);
			});

		});

		$J.describe("integrates with the command parser", function() {

			$J.it("should return with numbers as variables", function() {
				parser.evaluate("A = [1, 0; 0, 1]");

				var input = "inv(A)";
				var correct = [
					[1, 0],
					[0, 1]
				];
				parser.evaluate(input, function(err, ans) {

					console.debug("input : " + input);
					console.debug("output : ");
					console.debug(ans[0].ans);

					$J.expect(ans[0].ans).toEqual(correct);
				});
			});

		});
	});
});