define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mStatic.Divide()", function () {

    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9
    });

    it("should solve numeric equations", function (done) {
      var input = "4 / 2";
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

    it("should solve vector equations", function (done) {
      var input = "[4, 8] / 2";
      var correct = [
        [2, 4]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should solve vector equations", function (done) {
      var input = "[4; 8] / 2";
      var correct = [
        [2],
        [4]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should solve matrix equations", function (done) {
      var input = "[4, 8; 16, 24] / 2";
      var correct = [
        [2, 4],
        [8, 12]
      ];
      parser.evaluate(input, function (err, ans) {

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should divide by negative numebrs", function (done) {
      var input = "[4, 8; 16, 24] / -2";
      var correct = [
        [-2, -4],
        [-8, -12]
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