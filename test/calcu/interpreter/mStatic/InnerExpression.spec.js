define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe(
    "A suite for testing the `InnerExpression` functionality",
    function () {

      // setup the environment
      var epsilon = null; // how close the values should be
      var parser = null; // the parser
      $J.beforeEach(function () {
        parser = new CommandParser();
        // this gives the toBeMatrixCloseTo function
        $J.jasmine.Expectation.addMatchers(Matchers);
        epsilon = 1e-9;
      });

      it("should not fail with parenthases : `2 + (3) * 2` ", function (done) {
        var input = "2 + (3) * 2";
        parser.evaluate(input, function (err, ans) {
          var correct = [
            [8]
          ];
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          var ans = null;

          parser.evaluate(input, function (err, ans) {
            expect(err).toBeFalsy();
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);
            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
            done();
          });
        });
      });

      it(
        "should compute the correct answer with middle parens : `2 + (3) * 2 = 8` ",
        function (done) {
          var input = "2 + (3) * 2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [8]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with leading parens : `(3) * 2 + 2 = 8` ",
        function (done) {
          var input = "(3) * 2 + 2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [8]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with parens on both sides : `1 - (3) * 2 + 2 = -3` ",
        function (done) {
          var input = "1 - (3) * 2 + 2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [-3]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              expect(err).toBeFalsy();

              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with a different value inside : `(4) * 2 + 2 = 10` ",
        function (done) {
          var input = "(4) * 2 + 2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [10]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });

          });
        });

      it(
        "should compute the correct answer with a additin inside: `(4+2) * 2 + 2 = 14` ",
        function (done) {
          var input = "(4+2) * 2 + 2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [14]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with a subtraction inside: `(10-2)*2+2 = 18` ",
        function (done) {
          var input = "(10-2)*2+2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [18]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with a multiplication inside: `(10*2)*2+2 = 42` ",
        function (done) {
          var input = "(10*2)*2+2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [42]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with oop inside: `(10*2 -5)*2+2 = 32` ",
        function (done) {
          var input = "(10*2 -5)*2+2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [32]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with parens inside: `(10* (2 -5))*3+2 = -88` ",
        function (done) {
          var input = "(10* (2 -5))*3+2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [-88]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with 2 parens inside: `((10 + 7 ) * (2 -5))*3+2 = -151` ",
        function (done) {
          var input = "((10 + 7 ) * (2 -5))*3+2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [-151]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it(
        "should compute the correct answer with 2 nested inside: `((10 + (7 * 2 )) * (2 -5))*3+2 = -214` ",
        function (done) {
          var input = "((10 + (7 * 2 )) * (2 -5))*3+2";
          parser.evaluate(input, function (err, ans) {
            var correct = [
              [-214]
            ];
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            parser.evaluate(input, function (err, ans) {
              console.debug("input : " + input);
              console.debug("output : ");
              console.debug(ans[0].ans);
              expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
              done();
            });
          });
        });

      it("should compute the correct answer with parens around matrices", function (done) {
        var input = "([2, 3; -4, 5] -[6, 7; 8, -9]) * 5";
        parser.evaluate(input, function (err, ans) {
          var correct = [
            [-20, -20],
            [-60, 70]
          ];
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);
            expect(ans[0].ans).toBeMatrixCloseTo(correct, epsilon);
            done();
          });
        });
      });

      it("should compute the correct answer with parens inside matrices", function (done) {
        var input = "([((2 + 4) - 1), -3; -4, 5] -[6, 7; 8, -9]) * 5";
        parser.evaluate(input, function (err, ans) {
          var correct = [
            [-5, -50],
            [-60, 70]
          ];
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

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

})
;
