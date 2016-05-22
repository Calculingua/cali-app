define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
], function ($J, CommandParser, sinon) {


	$J.describe("cali.module.base.clear()", function() {

		// setup the environment
		var parser = null;
		var isEqual = null;
		$J.beforeEach(function() {
			parser = new CommandParser();
		});

		$J.describe("removes variables from the workspace", function() {

			$J.beforeEach(function() {
				parser.evaluate("A = [1, 0; 0, 1]");
				parser.evaluate("B = [0, 1; 1, 0]");
			});

			$J.afterEach(function() {
				parser.setVariables({});
			});

			$J.it("should remove all variables when called with no arguments", function() {
				var input = "clear()";
				var ans = parser.evaluate(input);

				console.debug("input : " + input);

				expect(parser.variables).toEqual({});
			});

			$J.it("should remove all variables when called without parens", function() {
				var input = "clear";
				var ans = parser.evaluate(input);

				console.debug("input : " + input);

				expect(parser.variables).toEqual({});
			});
		
			$J.it("should remove all variables when called with following argument `all`", function() {
				var input = "clear all";
				var ans = parser.evaluate(input);

				console.debug("input : " + input);

				expect(parser.variables).toEqual({});
			});
		
			$J.it("should remove an individual variables when called with a name following", function(){
				var input = "clear A";
				var ans = parser.evaluate(input);

				console.debug("input : " + input);

				expect(parser.variables.B).toBeTruthy();
			});
		
			$J.it("should remove multiple variables when called with multiple name following", function(){
				var input = "clear A B";
				var ans = parser.evaluate(input);

				console.debug("input : " + input);

				expect(parser.variables).toEqual({});
			});
		
			$J.it("should not throw an exception when called with a non-present variable", function(){
				var input = "clear C";
			
				expect(function(){
					var ans = parser.evaluate(input);
				}).not.toThrow();

				console.debug("input : " + input);

				expect(parser.variables.A).toBeTruthy();
				expect(parser.variables.B).toBeTruthy();
			});
		});
	});
});