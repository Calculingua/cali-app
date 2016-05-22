define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mStatic.elementwisePow()", function () {

    // setup the environment
    var parser = null;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    describe("performs powers in a elementwise fashion", function () {

      it("should perform on scalars `4 .^ 2 = 16`", function (done) {
        var input = "4 .^ 2";
        var correct = [
          [16]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });
      
      it("should perform on scalars without whitespace`4.^2 = 16`", function (done) {
        var input = "4.^2";
        var correct = [
          [16]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should perform on matrix to scalr `[4, 3; 3, 4] .^ 2 = [16, 9; 9, 16]`", function (done) {
        var input = "[4, 3; 3, 4] .^ 2 ";
        var correct = [
          [16, 9],
          [9, 16]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });
      
      it("should perform on matrix to scalar without whitespace`[4, 3; 3, 4].^2 = [16, 9; 9, 16]`", function (done) {
        var input = "[4, 3; 3, 4].^2 ";
        var correct = [
          [16, 9],
          [9, 16]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });
      
      it("should perform on variables", function () {
        var inputs = [
            "x = [4, 3; 3, 4]; x .^ 2 ",
            "x = [4, 3; 3, 4]; x.^2 ",
            "x = [4, 3; 3, 4]; x.^x "
        ];
        var test = [
            [[16, 9], [9, 16]],
            [[16, 9], [9, 16]],
            [[256, 27], [27, 256]]
        ];
        for(var i = 0; i < inputs.length; i++){
            parser.evaluate(inputs[i], function (err, ans) {

                expect(ans[1].ans).toEqual(test[i]);
            });
        }
        
      });

      it("should perform on matrix on matrix `[4, 3; 3, 4] .^ [2, 1; 2, 1] = [16, 3; 9, 4]`", function (done) {
        var input = "[4, 3; 3, 4] .^ [2, 1; 2, 1] ";
        var correct = [
          [16, 3],
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

      it("should throw an error on an ill-formed expression", function (done) {
        var input = "[4, 3; 3, 4] .^ [2, 1, 3; 2, 1, 3] ";
        console.debug("input : " + input);

        parser.evaluate(input, function (err, ans) {
          expect(err).toEqual("Operator Error :: ELEMENTWISE EXPONENTIAL : poorly formed RHS.");
          done();
        });
      });
    });
  });

});