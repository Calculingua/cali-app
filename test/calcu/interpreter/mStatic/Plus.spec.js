define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe(
    "A suite for testing the `Plus` functionality",
    function () {

      // setup the environment
      var parser = null;
      beforeEach(function () {
        parser = new CommandParser();
        $J.jasmine.Expectation.addMatchers(Matchers);
      });

      it("should add scalars `2 + 5 = 7`", function (done) {
        var input = "5 + 2";
        var correct = [
          [7]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should add scalars without spaces `2+5 = 7`", function (done) {
        var input = "5+2";
        var correct = [
          [7]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
          done();
        });
      });

      it("should add vectors `[2; 5] + [7; 2] = [9; 7]`", function (done) {
        var input = "[2; 5] + [7; 2]";
        var correct = [
          [9],
          [7]
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
        "should add matrices `[2, 3; 5, 6] + [7, 1; 2, 9] = [9, 4; 7, 15]`",
        function (done) {
          var input = "[2, 3; 5, 6] + [7, 1; 2, 9]";
          var correct = [
            [9, 4],
            [7, 15]
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
        "should add matrices with negative numbers `[2, -3; -5, 6] + [-7, 1; 2, -9] = [-5, -2; -3, -3]`",
        function (done) {
          var input = "[2, -3; -5, 6] + [-7, 1; 2, -9]";
          var correct = [
            [-5, -2],
            [-3, -3]
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
        "should add matrices `[2.1, 3.2; 5.0, 6.5] + [7.1, 1.3; 2.6, 9.4] = [9.2, 4.5; 7.6, 15.9]`",
        function (done) {
          var input = "[2.1, 3.2; 5.0, 6.5] + [7.1, 1.3; 2.6, 9.4]";
          var correct = [
            [9.2, 4.5],
            [7.6, 15.9]
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
        "should throw an exception with matrix scalar addition",
        function (done) {
          var input = "[2, 3; 5, 6] + 2";
          console.debug("input : " + input);

          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Opperation Error : ADDITION : " + "matrices have different numbers of rows.")
            done();
          });
        });

      it("should throw an exception with 2x2 + 2x1 ", function (done) {
        var input = "[2, 3; 5, 6] + [2, 3]";
        console.debug("input : " + input);

        parser.evaluate(input, function (err, ans) {
          expect(err).toEqual("Opperation Error : ADDITION : " + "matrices have different numbers of rows.");
          done();
        });
      });

      it(
        "should throw an exception with 2x2 + 1x2 ",
        function (done) {
          var input = "[2, 3; 5, 6] + [2; 3]";
          console.debug("input : " + input);

          parser.evaluate(input, function (err, ans) {
            expect(err).toEqual("Opperation Error : ADDITION : " + "matrices have different numbers of columns.");
            done();
          });
        });

    });
});

