define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
  "async",
], function ($J, CommandParser, sinon, Matchers, base, async) {
	
	$J.describe("cali.module.base.csvwrite()", function() {

		// setup the environment
		var parser = null;
		var model = null;
		$J.beforeEach(function() {
			model = new MockModel();
			parser = new CommandParser(null, model);
		});

		$J.describe("integrates with the command parser", function() {

			$J.beforeEach(function() {
				sinon.spy(model.file, "saveFile");
			});

			$J.afterEach(function() {
				model.file.saveFile.restore();
			});

			$J.describe("csvwrite(fn, M)", function() {

				$J.it("should write Matrix to fn", function(done) {

					var err = null;
					var check = "1,2,3,5\n5,6,7,8";
					var input = "x = csvwrite('./butts.csv', [1, 2, 3, 4; 5, 6, 7, 8])";

					parser.evaluate(input, function(e, a) {
						err = e;
						$J.expect(model.file.saveFile.callCount).toEqual(1);
						$J.expect(model.file.saveFile.getCall(0).args[0]).toEqual("./butts.csv");
						$J.expect(model.file.saveFile.getCall(0).args[1]).toEqual("1,2,3,4\n5,6,7,8\n");
						done();
					});
				});
			});

			$J.describe("csvwrite(fn, M, r)", function() {

				$J.it("should write Matrix sarting at row `r` to fn", function(done) {

					var err = null;
					var check = "1,2,3,5\n5,6,7,8";
					var input = "x = csvwrite('./butts.csv', [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16], 1)";

					parser.evaluate(input, function(e, a) {
						err = e;
						$J.expect(model.file.saveFile.callCount).toEqual(1);
						$J.expect(model.file.saveFile.getCall(0).args[0]).toEqual("./butts.csv");
						$J.expect(model.file.saveFile.getCall(0).args[1]).toEqual(",,,\n5,6,7,8\n9,10,11,12\n13,14,15,16\n");
						done();
					});
				});
			});
		
			$J.describe("csvwrite(fn, M, r, c)", function() {

				$J.it("should write Matrix sarting at row `r` and column `c` to fn", function(done) {

					var err = null;
					var check = "1,2,3,5\n5,6,7,8";
					var input = "x = csvwrite('./butts.csv', [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16], 1, 2)";

					parser.evaluate(input, function(e, a) {
						err = e;
						$J.expect(model.file.saveFile.callCount).toEqual(1);
						$J.expect(model.file.saveFile.getCall(0).args[0]).toEqual("./butts.csv");
						$J.expect(model.file.saveFile.getCall(0).args[1]).toEqual(",,,\n,,7,8\n,,11,12\n,,15,16\n");
						done();
					});
				});
			});
		});
	});

	function MockModel() {
		this.file = {
			readFile: function(fname, callback) {
				callback(null);
			},
			saveFile: function(fanme, text, callback) {
				callback(null);
			}
		};
	}
});