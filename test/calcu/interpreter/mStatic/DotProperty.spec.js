define([
  "cali-calcu/interpreter/mNative/nativeFunctions",
  "$J",
  "sinon",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function (nativeFunctions, $J, sinon, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mStatic.DotProperty()", function () {

    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("when there is a variable with properties", function () {
      beforeEach(function () {
        parser.evaluate("x = table([1; 2; 3], [4; 5; 6])", function () {

        });
      });

      describe("to access existing properties", function () {

        beforeEach(function () {
          sinon.spy(nativeFunctions, "getProperty");
          sinon.spy(nativeFunctions, "getColumn");
        });

        afterEach(function () {
          nativeFunctions.getProperty.restore();
          nativeFunctions.getColumn.restore();
        });

        it("should return the variable", function () {
          parser.evaluate("x.Var1", function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].ans).toEqual([
              [1],
              [2],
              [3]
            ]);
          });
        });

      });
    });
  });

});