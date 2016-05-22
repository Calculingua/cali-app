define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  describe("cali.calcu.interpreter.mStatic.elementwiseMultiply()", function () {

    // setup the environment
    var parser = null;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    describe("multiplies matrices in a pointwise fashion", function () {

      it("should multiply scalars `2 .* 5 = 10`", function (done) {
        var input = "2 .* 5";
        var correct = [
          [10]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should multiply scalars to Matrix `[2, 3] .* 2 = [4, 9]`", function (done) {
        var input = "[2, 3] .* 2";
        var correct = [
          [4, 6]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should multiply row `[2, 3] .* [2, 3] = [4, 9]`", function (done) {
        var input = "[2, 3] .* [2, 3]";
        var correct = [
          [4, 9]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should multiply cols `[2; 3] .* [2; 3] = [4; 9]`", function (done) {
        var input = "[2; 3] .* [2; 3]";
        var correct = [
          [4],
          [9]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should multiply arrays `[2, 3; 3, 2] .* [2, 3; 3, 2] = [4, 9; 9, 4]`", function (done) {
        var input = "[2, 3; 3, 2] .* [2, 3; 3, 2]";
        var correct = [
          [4, 9],
          [9, 4]
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
        var input = "[2, 3; 3, 2] .* [2, 3, 3; 3, 2, 3]";
        console.debug("input : " + input);

        parser.evaluate(input, function (err, ans) {
          expect(err).toEqual("Operator Error :: ELEMENTWISE MULTIPLICATION : poorly formed RHS.");
          done();
        });
      });
    });
  });

});