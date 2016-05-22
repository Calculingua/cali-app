define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe(
    "A suite for testing the `Multiply` functionality",
    function () {


      // setup the environment
      var epsilon = null; // how close the values should be
      var parser = null; // the parser
      beforeEach(function () {
        parser = new CommandParser();
        // this gives the toBeMatrixCloseTo function
        $J.jasmine.Expectation.addMatchers(Matchers);
        epsilon = 1e-9;
      });

      it("should multiply scalars `2 * 5 = 10`", function (done) {
        var input = "2 * 5";
        var correct = [
          [10]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
          done();
        });
      });

      it("should multiply vector/scalar `5 * [7; 2] = [35; 10]`",
        function (done) {
          var input = "5 * [7; 2]";
          var correct = [
            [35],
            [10]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
            done();
          });
        });

      it("should multiply vectors `[2, 5] * [7; 2] = 24`", function (done) {
        var input = "[2, 5] * [7; 2]";
        var correct = [
          [24]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
          done();
        });
      });

      it(
        "should multiply square matrices `[2, 3; 5, 6] * [7, 1; 2, 9] = [20, 29; 47,59]`",
        function (done) {
          var input = "[2, 3; 5, 6] * [7, 1; 2, 9]";
          var correct = [
            [20, 29],
            [47, 59]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
            done();
          });
        });

      it("should multiply non-square matrices (5x2 * 2x2)", function (done) {
        var input = " [7, 1; 2, 9; 5, 6; 9, 0; 1, 1] *[2, 3; 5, 6]";
        var correct = [
          [19, 27],
          [49, 60],
          [40, 51],
          [18, 27],
          [7, 9]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
          done();
        });
      });

      it(
        "should multiply matrices with negative numbers `[2, -3; -5, 6] * [-7, 1; 2, -9] = [-20, 29; 47, -59]`",
        function (done) {
          var input = "[2, -3; -5, 6] * [-7, 1; 2, -9]";
          var correct = [
            [-20, 29],
            [47, -59]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });

      it(
        "should multiply decmil matrices `[2.1, 3.2; 5.0, 6.5] * [7.1, 1.3; 2.6, 9.4] = [ 23.23, 32.81; 52.4, 67.6 ]`",
        function (done) {
          var input = "[2.1, 3.2; 5.0, 6.5] * [7.1, 1.3; 2.6, 9.4]";
          var correct = [
            [23.23, 32.81],
            [52.4, 67.6]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
            done();
          });
        });

      it(
        "should throw an exception with 2x1 * 2x1 ",
        function (done) {
          var input = "[2, 3] * [2, 3]";
          console.debug("input : " + input);


          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Operation Error : MULTIPLICATION : " + "matrices have different numbers of rows/columns.");
            done();
          });
        });

    });
});