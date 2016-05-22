define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("A suite for testing the colon `:` operator", function () {
    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    $J.it("should allow an expression with the colon `:` operator.", function (done) {
      var input = "2 : 5";

      parser.evaluate(input, function (err, ans) {
        expect(err).toBeFalsy();
        done();
      });

    });

    it("should get the right answer : `2 : 5 = [2, 3, 4, 5]", function (done) {
      var input = "2 : 5";
      var correct = [
        [2, 3, 4, 5]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should allow incrementing by 2 : `2 : 2 : 6 = [2, 4, 6]", function (done) {
      var input = "2 : 2 : 6";
      var correct = [
        [2, 4, 6]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should allow decrementing by 2 : `2 : -2 : -4 = [2, 0, -2, -4]", function (done) {
      var input = "2 : -2 : -4";
      var correct = [
        [2, 0, -2, -4]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should allow fractional incrementing by .2 : `2 : .2 : 3 = [2, 2.2, 2.4, 2.6, 2.8, 3]", function (done) {
      var input = "2 : .2 : 3";
      var correct = [
        [2, 2.2, 2.4, 2.6, 2.8, 3]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should allow fractional decrementing by .2 : `2 : -.2 : 1 = [2, 1.8, 1.6, 1.4, 1.2, 1]", function (done) {
      var input = "2 : -.2 : 1";
      var correct = [
        [2, 1.8, 1.6, 1.4, 1.2, 1]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should return a scalar when ther range is zero : `2 : -.2 : 3 = [2]", function (done) {
      var input = "2 : -.2 : 3";
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

    it("should work with brackets around it : `[2:5] = [2, 3, 4, 5]`", function (done) {
      var input = "[2:5]";
      var correct = [
        [2, 3, 4, 5]
      ];
      parser.evaluate(input, function (err, ans) {
        console.debug("input : " + input);
        console.debug("output : ");
        console.debug(ans[0].ans);

        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });

    it("should work inside a matrix : `[2:5; 9:12] = [2, 3, 4, 5; 9, 10, 11, 12]`", function (done) {
      var input = "[2:5; 9:12]";
      var correct = [
        [2, 3, 4, 5],
        [9, 10, 11, 12]
      ];
      parser.evaluate(input, function (err, ans) {
        expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
        done();
      });
    });
  });
});
