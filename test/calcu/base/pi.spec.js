define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/pi"
], function ($J, CommandParser, Matchers, pi) {


  $J.describe("cali.module.base.pi()", function () {

    // setup the environment
    var parser = null;
    var zeros = null;
    var epsilon = null;
    beforeEach(function () {
      parser = new CommandParser();

      jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-2;
    });

    describe("creates a constant equal to PI", function () {

      it("should return a 1x1", function () {
        var out = pi();
        expect(out).toBeMatrixCloseTo([
          [3.14]
        ], epsilon);
      });

    });

    describe("integrates with the command parser", function () {

      describe("that returns the constant equal to PI", function () {

        it("should return with scalar from `pi`", function () {
          var input = "pi";
          var correct = [
            [3.14]
          ];
          parser.evaluate(input, function (err, ans) {

            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
          });
        });

        it("should return with scalar from `pi()`", function () {
          var input = "pi()";
          var correct = [
            [3.14]
          ];
          parser.evaluate(input, function (err, ans) {

            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
          });
        });

        it("should throw an exception with arguments `pi(arg)`", function () {
          var input = "pi(1)";
          console.debug("input : " + input);

          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Operator Error :: PI : no arguments supported.");
          });
        });
      });
    });
  });

});