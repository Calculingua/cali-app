define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mStatic/End"
], function ($J, Matchers, CommandParser, End) {


  describe("cali.calcu.interpreter.mStatic.End", function () {

    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    it("should exist in the namespace", function () {
      expect(typeof End).toEqual("function");
    });

    describe("new End(input, position, parent, operators)", function () {
      describe("just advances the cursor", function () {
        var input = "if 4 >= 5 \n x = 3; \n end\n";
        var args = parser.preprocess(input);
        var exp = new If(args, 9, null, parser.operators);
        expect(exp.pos).toEqual(10);
      });
    });

  });

});
