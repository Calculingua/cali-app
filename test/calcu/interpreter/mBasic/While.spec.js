define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mBasic/While"
], function ($J, Matchers, CommandParser, While) {

  $J.describe("cali.calcu.interpreter.mBasic.While", function () {

    // setup the environment
    var parser = null; // the parser
    $J.beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    it("should exist in the namespace", function () {
      expect(typeof While).toEqual("function");
    });

    describe("new While(input, position, parent, operators)", function () {
      describe("creates an new expression for the test arg", function () {
        it("should have arg[0] as an expression without parens", function () {
          var input = "while x < 4 \n x = x + 1; \n end\n";
          var args = parser.preprocess(input);
          var exp = new While(args, 0, null, parser.operators);
          expect(exp.args[0].type).toEqual("EXPRESSION");
        });

        it("should have arg[0] as an expression with parens", function () {
          var input = "while (x < 4) \n x = x + 1; \n end\n";
          var args = parser.preprocess(input);
          var exp = new While(args, 0, null, parser.operators);
          expect(exp.args[0].type).toEqual("EXPRESSION");
        });
      });

      describe("repeat lines are placed in exec", function () {
        it("should have exec as array of expressions", function () {
          var input = "while x < 4 \n x = x + 1; \n y = y + 1;\n end\n";
          var args = parser.preprocess(input);
          var exp = new While(args, 0, null, parser.operators);
          expect(exp.exec.length).toEqual(2);
          expect(exp.pos).toEqual(20);
        });
      });
    });

    describe("#interpret(variables, outputCallback)", function () {

      describe("interprets exec[] until the loop is false", function () {

        describe("interprets the test multiple times", function () {

          var exp = null;
          var variables = {
            x: [
              [ 0 ]
            ],
            y: [
              [ 1 ]
            ]
          };

          function callback(output) {

          }

          var opts = {variables: variables, outputCallback: callback}
          beforeEach(function () {
            var input = "while x < 4 \n x = x + 1; \n y = y + 1;\n end\n";
            var args = parser.preprocess(input);
            exp = new While(args, 0, null, parser.operators);
          });

          it("should interpret the test each time", function (done) {
            var spy = sinon.spy(exp.args[0].args[0], "interpret");
            exp.interpret(opts, function (err, ans) {
              expect(spy.callCount).toEqual(5);
              expect(opts.variables.x).toEqual([
                [ 4 ]
              ]);
              spy.restore();
              done();
            });
          });
        });

        describe("calles exec[] each time until the test fails", function () {

          var exp = null;
          var variables = {
            x: [
              [ 1 ]
            ],
            y: [
              [ 1 ]
            ]
          };

          function callback(output) {

          }

          var opts = {variables: variables, outputCallback: callback}
          beforeEach(function () {
            var input = "while x < 4 \n x = x + 1; \n y = y + 1;\n end\n";
            var args = parser.preprocess(input);
            exp = new While(args, 0, null, parser.operators);
          });

          it("should call exec multiple times", function (done) {
            var spy0 = sinon.spy(exp.exec[0], "interpret");
            var spy1 = sinon.spy(exp.exec[1], "interpret");
            exp.interpret(opts, function (err, ans) {
              expect(spy0.callCount).toEqual(3);
              expect(spy1.callCount).toEqual(3);
              spy0.restore();
              spy1.restore();
              done();
            });

          });
        });

        describe("works with matrix test outputs", function () {

          var exp = null;
          var variables = {
            x: [
              [ 2, 2, 3 ],
              [ 4, 5, 6 ]
            ],
            y: [
              [ 1 ]
            ]
          };

          function callback(output) {

          }

          var opts = {variables: variables, outputCallback: callback}
          beforeEach(function () {
            var input = "while x > 0 \n x = x - ones(2, 3); \n end\n";
            var args = parser.preprocess(input);
            exp = new While(args, 0, null, parser.operators);
          });

          it("should call exec multiple times", function (done) {
            var spy0 = sinon.spy(exp.exec[0], "interpret");
            exp.interpret(opts, function (err, ans) {
              expect(spy0.callCount).toEqual(2);
              spy0.restore();
              done();
            });

          });
        });

      });
    });

    describe("break", function () {
      describe("breaks out of the loop", function () {

        var exp = null;
        var variables = {
          x: [
            [ 0 ]
          ],
          y: [
            [ 1 ]
          ]
        };

        function callback(output) {

        }

        var opts = {variables: variables, outputCallback: callback}
        beforeEach(function () {
          var input = "while x < 4 \n x = x + 1; if( x == 2)\n break\n end\n end\n";
          var args = parser.preprocess(input);
          exp = new While(args, 0, null, parser.operators);
        });

        it("should not call it the full number of times", function (done) {
          var spy0 = sinon.spy(exp.exec[0], "interpret");
          exp.interpret(opts, function (err, ans) {
            expect(spy0.callCount).toEqual(2);
            expect(variables.x).toEqual([
              [ 2 ]
            ]);
            spy0.restore();
            done();
          });
        });
      });
    });

    describe("continue", function () {
      describe("imedieatly contines to next loop", function () {

        var exp = null;
        var variables = {
          x: [
            [ 0 ]
          ],
          y: [
            [ 1 ]
          ]
        };

        function callback(output) {

        }

        var opts = {variables: variables, outputCallback: callback};
        beforeEach(function () {
          var input = "while x < 4 \n x = x + 1; if( x == 2)\n continue\n end\n y = y + 1;\n end\n";
          var args = parser.preprocess(input);
          exp = new While(args, 0, null, parser.operators);
        });

        it("should not call it the full number of times", function (done) {
          var spy0 = sinon.spy(exp.exec[0], "interpret");
          var spy2 = sinon.spy(exp.exec[2], "interpret");
          exp.interpret(opts, function (err, ans) {
            expect(spy0.callCount).toEqual(4);
            expect(spy2.callCount).toEqual(3);
            spy0.restore();
            spy2.restore();
            done();
          });

        });
      });
    });

    describe("integrates with the parser", function () {
      it("should be in the script", function (done) {
        var input = "x = 0; y = 1; \n while x < 4 \n x = x + 1; \n y = y + 1;\n end\n";
        var ans = parser.evaluate(input, function (err, ans) {
          expect(ans).toBeTruthy();
          done();
        });

      });

      it("should nest fine", function (done) {
        var input = "x = 0; y = 0; \n while x < 4 \n x = x + 1; \n i = 0; \n while i < 10 \n y = y + 1 \n i = i + 1 \n end\n end\n";
        var ans = parser.evaluate(input, function (err, ans) {
          expect(ans).toBeTruthy();
          expect(parser.variables.y[0][0]).toEqual(40);
          expect(parser.variables.x[0][0]).toEqual(4);
          done();
        });
      });
    });

  });

});