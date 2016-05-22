define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe(
    "A suite for testing the `Minus` functionality",
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

      it("should subtract scalars `2 - 5 = -3`", function (done) {
        var input = "2 - 5";
        var correct = [
          [-3]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should subtract scalars without spaces `2-5 = -3`", function (done) {
        var input = "2-5";
        var correct = [
          [-3]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should subtract vectors `[2; 5] - [7; 2] = [-5; 3]`",
        function (done) {
          var input = "[2; 5] - [7; 2]";
          var correct = [
            [-5],
            [3]
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
        "should subtract matrices `[2, 3; 5, 6] - [7, 1; 2, 9] = [-5, 2; 3, -3]`",
        function (done) {
          var input = "[2, 3; 5, 6] - [7, 1; 2, 9]";
          var correct = [
            [-5, 2],
            [3, -3]
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
        "should subtract matrices with negative numbers `[2, -3; -5, 6] - [-7, 1; 2, -9] = [9, -4; -7, 15]`",
        function (done) {
          var input = "[2, -3; -5, 6] - [-7, 1; 2, -9]";
          var correct = [
            [9, -4],
            [-7, 15]
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
        "should subtract decmil matrices `[2.1, 3.2; 5.0, 6.5] - [7.1, 1.3; 2.6, 9.4] = [-5, 1.9; 2.4, -2.9]`",
        function (done) {
          var input = "[2.1, 3.2; 5.0, 6.5] - [7.1, 1.3; 2.6, 9.4]";
          var correct = [
            [-5, 1.9],
            [2.4, -2.9]
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
        "should throw an exception with matrix scalar subtractition",
        function (done) {
          var input = "[2, 3; 5, 6] - 2";
          console.debug("input : " + input);

          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Opperation Error : SUBTRACTION : " + "matrices have different numbers of rows.");
            done();
          });
        });

      it("should throw an exception with 2x2 1 2x1 ", function (done) {
        var input = "[2, 3; 5, 6] - [2, 3]";
        console.debug("input : " + input);

        parser.evaluate(input, function (err, ans) {
          expect(err).toEqual("Opperation Error : SUBTRACTION : " + "matrices have different numbers of rows.");
          done();
        });

      });

      it(
        "should throw an exception with 2x2 1 1x2 ",
        function (done) {
          var input = "[2, 3; 5, 6] - [2; 3]";
          console.debug("input : " + input);

          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Opperation Error : SUBTRACTION : " + "matrices have different numbers of columns.")
            done();
          });
        });

    });
});