define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mStatic.elementwiseDivide()", function () {

    // setup the environment
    var parser = null;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    $J.describe("divides matrices in a elementwise fashion", function () {

      it("should divide scalars `4 ./ 2 = 2`", function (done) {
        var input = "4 ./ 2";
        var correct = [
          [2]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should divide matrix by scalar  `[4, 8] ./ 2 = [2, 4]`", function (done) {
        var input = "[4, 8] ./ 2";
        var correct = [
          [2, 4]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should divide row `[4, 8] ./ [2, 4] = [2, 2]`", function (done) {
        var input = "[4, 8] ./ [2, 4]";
        var correct = [
          [2, 2]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should divide row `[4; 8] ./ [2; 4] = [2; 2]`", function (done) {
        var input = "[4; 8] ./ [2; 4]";
        var correct = [
          [2],
          [2]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should divide row `[4, 8; 8, 4] ./ [2, 4; 4, 2] = [2, 2; 2, 2]`", function (done) {
        var input = "[4, 8; 8, 4] ./ [2, 4; 4, 2]";
        var correct = [
          [2, 2],
          [2, 2]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should throw an error on poorly formed inputs", function (done) {
        var input = "[2, 3; 3, 2] ./ [2, 3, 3; 3, 2, 3]";
        console.debug("input : " + input);


        parser.evaluate(input, function (err, ans) {
          expect(err).toEqual("Operator Error :: ELEMENTWISE DIVISION : poorly formed RHS.");
          done();
        });
      });

    });
  });
});