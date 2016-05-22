define([
  "$J",
  "sinon",
  "cali-calcu/interpreter/mBasic/For",
  "cali-calcu/CommandParser",
  "../../dev/Matchers"
], function ($J, sinon, For, CommandParser, Matchers) {


  $J.describe("cali.calcu.interpreter.mBasic.For", function () {

    // setup the environment
    var parser = null; // the parser
    $J.beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    // it("should exist in the namespace", function() {
    // 	expect(typeof For).toEqual("function");
    // });

    $J.describe("new For(input, position, parent, operators)", function () {
      $J.describe("creates an new expression for the test arg", function () {
        $J.it("should have arg[0] as an expression without parens", function () {
          var input = "for x = 1:10 \n y = y + 1; \n end\n";
          var args = parser.preprocess(input);
          var exp = new For(args, 0, null, parser.operators);
          $J.expect(exp.args[0].type).toEqual("EXPRESSION");
          $J.expect(exp.args[0].output).toEqual("x");
        });

        $J.it("should have arg[0] as an expression with parens", function () {
          var input = "for( x = 1:10 )\n y = y + 1; \n end\n";
          var args = parser.preprocess(input);
          var exp = new For(args, 0, null, parser.operators);
          $J.expect(exp.args[0].type).toEqual("EXPRESSION");
          $J.expect(exp.args[0].output).toEqual("x");
        });

        $J.it("should throw an error if there is no equal sign in test argument", function () {
          var input = "for 1:10\n y = y + 1; \n end\n";
          var args = parser.preprocess(input);
          $J.expect(function () {
            exp = new For(args, 0, null, parser.operators);
          }).toThrow("Operation Error :: FOR : unbalanced test expression.");
        });
      });

      $J.describe("repeat lines are placed in exec", function () {
        $J.it("should have exec as array of expressions", function () {
          var input = "for x = 1:10\n y = y + x; \n z = y + 2; \n end\n";
          var args = parser.preprocess(input);
          var exp = new For(args, 0, null, parser.operators);
          $J.expect(exp.exec.length).toEqual(2);
          $J.expect(exp.pos).toEqual(22);
        });
      });
    });

    $J.describe("#interpret(variables, outputCallback)", function () {

      var opts = {};
      $J.beforeEach(function () {
        opts.variables = {};
        opts.outputCallback = function () {
        }
      });

      $J.describe("interprets exex[] once for every column in the test array", function () {

        $J.describe("interprets the test once", function () {

          var exp = null;

          function callback(output) {

          }

          $J.beforeEach(function () {
            var input = "for x = 1:3\n y = 2 + x; \n z = y + 2; \n end\n";
            var args = parser.preprocess(input);
            exp = new For(args, 0, null, parser.operators);
            opts.variables = {};
            opts.outputCallback = callback;
          });

          $J.it("should interpret the test once", function (done) {
            var spy = sinon.spy(exp.args[0].args[0], "interpret");
            exp.interpret(opts, function (err, ans) {
              $J.expect(spy.callCount).toEqual(1);
              spy.restore();
              done();
            });
          });
        });

        $J.describe("calls exec array once for each column in test with updated variables", function () {
          $J.describe("with 1xN exec array", function () {
            var exp = null;
            $J.beforeEach(function () {
              var input = "for x = 1:3\n y = 2 + x; \n z = y + 2; \n end\n";
              var args = parser.preprocess(input);
              exp = new For(args, 0, null, parser.operators);
            });

            $J.it("should call exec N times", function (done) {
              var spy0 = sinon.spy(exp.exec[0], "interpret");
              var spy1 = sinon.spy(exp.exec[1], "interpret");
              exp.interpret(opts, function (err, ans) {
                $J.expect(spy0.callCount).toEqual(3);
                $J.expect(spy1.callCount).toEqual(3);
                $J.expect(opts.variables.y).toEqual([
                  [ 5 ]
                ]);
                spy0.restore();
                spy1.restore();
                done();
              });

            });
          });

          $J.describe("with MxN exec array", function () {
            var exp = null;
            var variables = {};

            function callback(output) {

            }

            $J.beforeEach(function () {
              var input = "for x = ones(2,3) \n y = 2 + x; \n z = y + 2; \n end\n";
              var args = parser.preprocess(input);
              exp = new For(args, 0, null, parser.operators);
            });

            $J.it("should call exec m*n times", function (done) {
              var spy0 = sinon.spy(exp.exec[0], "interpret");
              var spy1 = sinon.spy(exp.exec[1], "interpret");
              exp.interpret(opts, function (err, ans) {
                $J.expect(spy0.callCount).toEqual(6);
                $J.expect(spy1.callCount).toEqual(6);
                $J.expect(opts.variables.y).toEqual([
                  [ 3 ]
                ]);
                spy0.restore();
                spy1.restore();
                done();
              });
            });
          });
        });
      });
    });

    $J.describe("break", function () {

      $J.describe("breaks out of the loop", function () {

        var exp = null;
        var opts = {};
        $J.beforeEach(function () {
          var input = "for x = 1:10\n y = 2 + x; \n if(y == 5) \n break \n end \n end\n";
          var args = parser.preprocess(input);
          exp = new For(args, 0, null, parser.operators);
          opts.variables = {};
          opts.outputCallback = function () {
          }
        });

        $J.it("should not call it the full number of times", function (done) {
          var spy0 = sinon.spy(exp.exec[0], "interpret");
          exp.interpret(opts, function (err, ans) {
            $J.expect(spy0.callCount).toEqual(3);
            $J.expect(opts.variables.y).toEqual([
              [ 5 ]
            ]);
            spy0.restore();
            done();
          });
        });
      });
    });

    $J.describe("continue", function () {
      var opts = {};
      $J.beforeEach(function () {
        opts.variables = {};
        opts.outputCallback = function () {
        }
      });

      $J.describe("imedieatly contines to next loop", function () {

        var exp = null;
        $J.beforeEach(function () {
          var input = "for x = 1:5\n y = 2 + x; \n if(y > 4) \n continue \n end \n z = 3 + y; \n end\n";
          var args = parser.preprocess(input);
          exp = new For(args, 0, null, parser.operators);
        });

        $J.it("should not call it the full number of times", function (done) {
          var spy0 = sinon.spy(exp.exec[0], "interpret");
          var spy2 = sinon.spy(exp.exec[2], "interpret");
          var callcount = 0;
          exp.interpret(opts, function (err, ans) {
            callcount++;
            console.log("#### callcount:", callcount);
            $J.expect(spy0.callCount).toEqual(5);
            $J.expect(spy2.callCount).toEqual(2);
            spy0.restore();
            spy2.restore();
            done()
          });

        });
      });
    });

    $J.describe("integrates with the parser", function () {
      $J.it("should be in the script", function (done) {
        var input = "z = 0; \n y = 0; \n for x = 1:3\n y = 2 + y; \n z = 1 + z; \n end\n";
        parser.evaluate(input, function (err, ans) {
          $J.expect(err).toBeFalsy()
          $J.expect(parser.variables.z[0][0]).toEqual(3);
          $J.expect(parser.variables.y[0][0]).toEqual(6);
          done();
        });

      });

      $J.it("should nest fine", function (done) {
        var input = "z = 0; \n p = 0; \n" + "for x = 1:3\n z = z + 1; \n for y = 1:10\n p = p + 1;\n end\n end\n";
        parser.evaluate(input, function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(parser.variables.z[0][0]).toEqual(3);
          $J.expect(parser.variables.p[0][0]).toEqual(30);
          done();
        });
      });
    });

  });

});