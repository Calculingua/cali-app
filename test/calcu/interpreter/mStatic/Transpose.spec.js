define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("A suite for testing the `Transpose` functionality", function () {

    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    it("should transpose vectors `[2; 3]' = [2, 3]`", function (done) {
      var input = "[2; 3]'";
      var correct = [
        [2, 3]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should transpose rows `[2, 3]' = [2; 3]`", function (done) {
      var input = "[2, 3]'";
      var correct = [
        [2],
        [3]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should transpose matrices `[2, 3; 4, 5]' = [2, 4; 3, 5]`", function (done) {
      var input = "[2, 3; 4, 5]'";
      var correct = [
        [2, 4],
        [3, 5]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should handle scalars `2' = 2`", function (done) {
      var input = "2'";
      var correct = [
        [2]
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
