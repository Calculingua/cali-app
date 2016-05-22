define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
  "async",
], function ($J, CommandParser, sinon, Matchers, base, async) {

	$J.describe("cali.module.base.csvread(fname)", function() {

		// setup the environment
		var parser = null;
		var model = null;
		$J.beforeEach(function() {
			model = new MockModel();
			parser = new CommandParser(null, model);
		});

		$J.describe("integrates with the command parser", function() {

			$J.it("should call the parser's file model", function(done) {

				var err = null;
				sinon.spy(model.file, "readFile");
				var input = "x = csvread('./butts.csv')";

				parser.evaluate(input, function(e, a) {
					$J.expect(model.file.readFile.callCount).toEqual(1);
					done();
				});
			});

			$J.describe("when it gets a text file returned", function() {
				var txt = null;
				$J.beforeEach(function() {
					txt = "1,2,3,4,5\n6,7,8, 9, 10\n11, 12, 13, 14, 15";
					sinon.stub(model.file, "readFile", function(fname, callback) {
						callback(null, txt);
					});
				})

				$J.it("should parse the file", function(done) {
					var err = null;
					var ans = null;
					var input = "x = csvread('./butts.csv')";

					parser.evaluate(input, function(e, a) {
						err = e;
						ans = a;
						$J.expect(ans[0].ans).toEqual([
							[1, 2, 3, 4, 5],
							[6, 7, 8, 9, 10],
							[11, 12, 13, 14, 15]
						]);
						$J.expect(err).toBeFalsy();
						done();
					});
				});
			});
		});

		$J.describe("arguments", function() {
			var txt = null;
			$J.beforeEach(function() {
				txt = "1,2,3,4,5\n6,7,8, 9, 10\n11, 12, 13, 14, 15\n16, 17, 18, 19, 20";
				sinon.stub(model.file, "readFile", function(fname, callback) {
					callback(null, txt);
				});
			});

			$J.describe("csvread('butts.csv')", function() {
				$J.it("should return the whole file", function(done) {
					var err = null;
					var ans = null;
					var input = "x = csvread('./butts.csv')";

					parser.evaluate(input, function(e, a) {
						err = e;
						ans = a;
						$J.expect(ans[0].ans).toEqual([
							[1, 2, 3, 4, 5],
							[6, 7, 8, 9, 10],
							[11, 12, 13, 14, 15],
							[16, 17, 18, 19, 20]
						]);
						$J.expect(err).toBeFalsy();
						done();
					});
				});
			});

			$J.describe("csvread('butts.csv', x)", function() {
				$J.it("should return the smaller file", function(done) {
					var err = null;
					var ans = null;
					var input = "x = csvread('./butts.csv', 2)";

					parser.evaluate(input, function(e, a) {
						err = e;
						ans = a;
						$J.expect(ans[0].ans).toEqual([
							[11, 12, 13, 14, 15],
							[16, 17, 18, 19, 20]
						]);
						$J.expect(err).toBeFalsy();
						done();
					});
				});
			});

			$J.describe("csvread('butts.csv', x, y)", function() {
				$J.it("should return the smaller file", function(done) {
					var err = null;
					var ans = null;
					var input = "x = csvread('./butts.csv', 2, 2)";

					parser.evaluate(input, function(e, a) {
						err = e;
						ans = a;
						$J.expect(ans[0].ans).toEqual([
							[13, 14, 15],
							[18, 19, 20]
						]);
						$J.expect(err).toBeFalsy();
						done();
					});
				});
			});

			$J.describe("csvread('butts.csv', x, y, [a, b, c, d])", function() {
				$J.describe("when `x == a` and `y == b`", function() {

					$J.it("should return the file bounded by `[a, b, c, d]`", function(done) {
						var err = null;
						var ans = null;
						var input = "x = csvread('./butts.csv', 1, 1, [1, 1, 2, 3])";

						parser.evaluate(input, function(e, a) {
							err = e;
							ans = a;
							$J.expect(ans[0].ans).toEqual([
								[7, 8, 9],
								[12, 13, 14],
							]);
							$J.expect(err).toBeFalsy();
							done();
						});
					});
				});

				$J.describe("when `x != a` or `y != b`", function() {

					$J.it("should return an error", function(done) {
						var err = null;
						var ans = null;
						var input = "x = csvread('./butts.csv', 2, 2, [1, 1, 2, 3])";

						parser.evaluate(input, function(e, a) {
							err = e;
							ans = a;
							$J.expect(ans.length).toEqual(0)
							$J.expect(err).toBeTruthy();
							$J.expect(err.toString()).toEqual("R and C should match RANGE");
							done();
						});
					});

					$J.it("should return an error", function(done) {
						var err = null;
						var ans = null;
						var input = "x = csvread('./butts.csv', 2, 1, [1, 1, 2, 3])";

						parser.evaluate(input, function(e, a) {
							err = e;
							ans = a;
							$J.expect(ans.length).toEqual(0)
							$J.expect(err).toBeTruthy();
							$J.expect(err.toString()).toEqual("R and C should match RANGE");
							done();
						});
					});

					$J.it("should return an error", function(done) {
						var err = null;
						var ans = null;
						var input = "x = csvread('./butts.csv', 1, 2, [1, 1, 2, 3])";

						parser.evaluate(input, function(e, a) {
							err = e;
							ans = a;
							$J.expect(ans.length).toEqual(0)
							$J.expect(err).toBeTruthy();
							$J.expect(err.toString()).toEqual("R and C should match RANGE");
							done();
						});
					});
				});

				$J.describe("when `c` and/or `d` are missing", function() {

					$J.it("should return an error", function(done) {
						var err = null;
						var ans = null;
						var input = "x = csvread('./butts.csv', 1, 1, [1, 1, 2])";

						parser.evaluate(input, function(e, a) {
							err = e;
							ans = a;
							$J.expect(ans.length).toEqual(0)
							$J.expect(err).toBeTruthy();
							$J.expect(err.toString()).toEqual("RANGE should be length 4");
							done();
						});
					});
				
					$J.it("should return an error", function(done) {
						var err = null;
						var ans = null;
						var input = "x = csvread('./butts.csv', 1, 1, [1, 1])";

						parser.evaluate(input, function(e, a) {
							err = e;
							ans = a;
							$J.expect(ans.length).toEqual(0)
							$J.expect(err).toBeTruthy();
							$J.expect(err.toString()).toEqual("RANGE should be length 4");
							done();
						});
					});
				});

			});
		});
	});

	function MockModel() {
		this.file = {
			readFile: function(fname, callback) {
				callback(null)
			}
		};
	}
});