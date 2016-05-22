define([
  "$J",
  "cali-calcu/CommandParser",
  "cali-calcu/base/baseFunctions"
], function ($J, CommandParser, base) {
	
	$J.describe("cali.module.base.eye(n, m)", function() {

		// setup the environment
		var parser = null;
		var eye = null;
		$J.beforeEach(function() {
			parser = new CommandParser();
			eye = base.eye;
		});

		$J.describe("creates Identity matrix", function() {

			$J.it("should return a 2x2", function() {
				var out = eye(2, 2);
				$J.expect(out).toEqual([ [ 1, 0 ], [ 0, 1 ] ]);
			});

			$J.it("should return a 1x1", function() {
				var out = eye(1, 1);
				$J.expect(out).toEqual([ [ 1 ] ]);
			});

			$J.it("should return a 3x2", function() {
				var out = eye(3, 2);
				$J.expect(out).toEqual([ [ 1, 0 ], [ 0, 1 ], [ 0, 0 ] ]);
			});

			$J.it("should return a 2x3", function() {
				var out = eye(2, 3);
				$J.expect(out).toEqual([ [ 1, 0, 0 ], [ 0, 1, 0 ] ]);
			});

			$J.it("should return a square identity when only a sigle variable is specified", function() {
				var out = eye(2);
				$J.expect(out).toEqual([ [ 1, 0 ], [ 0, 1 ] ]);
			});
		});

		$J.describe("integrates with the command parser", function() {

			$J.it("should return with numbers as variables", function() {
				var input = "eye(2, 2)";
				var correct = [ [ 1, 0 ], [ 0, 1 ] ];
				parser.evaluate(input, function(err, ans){

					$J.expect(ans[0].ans).toEqual(correct);
				});
			});

			$J.it("should return with variables as variables", function() {
				parser.evaluate("x = 2");
				parser.evaluate("y = 2");

				var input = "eye(x, y)";
				var correct = [ [ 1, 0 ], [ 0, 1 ] ];
				parser.evaluate(input, function(err, ans){

					$J.expect(ans[0].ans).toEqual(correct);
				});
			});
		});
	});
});