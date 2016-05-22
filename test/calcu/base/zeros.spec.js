define([
  "cali-calcu/base/zeros",
  "sinon",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (zeros, sinon, $J, CommandParser, Matchers) {

describe("cali.module.base.zeros(n, m)", function() {

	// setup the environment
	var parser = null;
	beforeEach(function() {
		parser = new CommandParser();
	});

	describe("creates a matrix of zeros", function() {

		it("should return a 2x2", function() {
			var out = zeros(2, 2);
			expect(out).toEqual([
				[0, 0],
				[0, 0]
			]);
		});

		it("should return a 1x1", function() {
			var out = zeros(1, 1);
			expect(out).toEqual([
				[0]
			]);
		});

		it("should return a 3x2", function() {
			var out = zeros(3, 2);
			expect(out).toEqual([
				[0, 0],
				[0, 0],
				[0, 0]
			]);
		});

		it("should return a 2x3", function() {
			var out = zeros(2, 3);
			expect(out).toEqual([
				[0, 0, 0],
				[0, 0, 0]
			]);
		});

		it("should return a squar when only 1 input specified", function() {
			var out = zeros(3);
			expect(out).toEqual([
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			]);
		});
	});

	describe("integrates with the command parser", function() {

		it("should return with numbers as variables", function() {
			var input = "zeros(2, 2)";
			var correct = [
				[0, 0],
				[0, 0]
			];
			parser.evaluate(input, function(err, ans) {
				console.debug("input : " + input);
				console.debug("output : ");
				console.debug(ans[0].ans);

				expect(ans[0].ans).toEqual(correct);
			});
		});

		it("should return with variables as variables", function() {
			parser.evaluate("x = 2");
			parser.evaluate("y = 2");

			var input = "zeros(x, y)";
			var correct = [
				[0, 0],
				[0, 0]
			];
			parser.evaluate(input, function(err, ans) {

				console.debug("input : " + input);
				console.debug("output : ");
				console.debug(ans[0].ans);

				expect(ans[0].ans).toEqual(correct);
			});
		});
	});
});
});
