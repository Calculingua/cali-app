define([
  "cali-calcu/interpreter/mStatic/LogicalOr",
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function (LogicalOr, $J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mStatic.LogicalOr", function () {

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
      expect(typeof LogicalOr).toEqual("function");
    });

    describe("performs the logical or of the LHS and RHS", function () {
      describe("that only work in the scalar-scalar case", function () {
        describe("returns 1 for true", function () {
          it("should return `1` from `1 || 1'", function (done) {
            var input = "1 || 1";
            var correct = [
              [1]
            ];
            parser.evaluate(input, function (err, ans) {
              expect(ans[0].ans).toEqual([
                [1]
              ]);
              done();
            });
          });

          it("should return `1` from `4 > 0 || 0 > -6'", function (done) {
            var input = "4 > 3 || -3 > -6";
            var correct = [
              [1]
            ];
            parser.evaluate(input, function (err, ans) {
              expect(ans[0].ans).toEqual(correct);
              done();
            });
          });

          it("should return `1` from `0 || 1 && 1 || 0'", function (done) {
            var input = "0 || 1 && 1 || 0";
            var correct = [
              [1]
            ];
            parser.evaluate(input, function (err, ans) {
              expect(ans[0].ans).toEqual(correct);
              done();
            });
          });
        });

        describe("returns 0 for false", function () {
          it("should return `0` from `0 || 0'", function (done) {
            var input = "0 || 0";
            var correct = [
              [0]
            ];
            parser.evaluate(input, function (err, ans) {
              expect(ans[0].ans).toEqual(correct);
              done();
            });
          });

          it("should return `0` from `0 || 1 && 0 || 0'", function (done) {
            var input = "0 || 1 && 0 || 0";
            var correct = [
              [0]
            ];
            parser.evaluate(input, function (err, ans) {
              expect(ans[0].ans).toEqual(correct);
              done();
            });

          });
        });

        describe("that is a short circuit operator", function () {
          it("should return `1` from `1 || butts '", function (done) {
            var input = "1 || butts";
            var correct = [
              [1]
            ];
            parser.evaluate(input, function (err, ans) {
              expect(ans[0].ans).toEqual(correct);
              done();
            });

          });

          it("should throw an error from `butts || 1`", function (done) {

            var input = "butts || 0";
            parser.evaluate(input, function (err, ans) {
              expect(err).toEqual("Exception with variable 'butts', variable not initialized.");
              done();
            });
          });
        });
      });

      describe("throws an error if either argument is an array", function () {
        it("should throw an error with matrix input", function (done) {
          var input = "[1, 2] || 0";
          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Operation Error :: OR :: requires scalar values convertible to logicals.");
            done();
          });

        });

        it("should throw an error with matrix input", function (done) {

          var input = "0 || [1, 2]";
          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Operation Error :: OR :: requires scalar values convertible to logicals.")
            done();
          });
        });
      });
    });
  });

});