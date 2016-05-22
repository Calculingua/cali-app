define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mStatic.Backslash()", function () {

    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    it("should solve equations", function (done) {
      var input = "[1, 2; 3, 4] \\\ [17; 39]";
      var correct = [
        [5],
        [6]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

  });

});