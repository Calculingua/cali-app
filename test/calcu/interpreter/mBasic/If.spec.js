define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mBasic/If",
  "sinon"
], function ($J, Matchers, CommandParser, If, sinon) {

  $J.describe("cali.calcu.interpreter.mBasic.If", function () {

    // setup the environment
    var parser = null; // the parser
    $J.beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    $J.it("should exist in the namespace", function () {
      $J.expect(typeof If).toEqual("function");
    });

    $J.describe("new If(input, position, parent, operators)", function () {

      $J.describe("creates an new expression for the test arg", function () {
        $J.it("should have arg[0] as an expression", function () {
          var input = "if 4 >= 5 \n x = 3; \n end\n";
          var args = parser.preprocess(input);
          var exp = new If(args, 0, null, parser.operators);
          $J.expect(exp.args[0].type).toEqual("EXPRESSION");
        });
      });

      $J.describe("if - end", function () {
        $J.describe("creates an array for evaluation and stores it in exec array", function () {
          it("should have exec[0] as array of expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n end\n";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.exec[0].length).toEqual(2);
            $J.expect(exp.pos).toEqual(15);
          });
        });
      });

      $J.describe("if - else - end", function () {
        $J.describe("creates an array for evaluation and stores it in exec array", function () {
          it("should have exec[0] and exec[1] as array of expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n else \n y = 4 \n end";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.exec[0].length).toEqual(2);
            $J.expect(exp.exec[1].length).toEqual(1);
            $J.expect(exp.pos).toEqual(21);
          });

          $J.it("should have args[0] and args[1] as single expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n else \n y = 4 \n end";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.args[0].type).toEqual("EXPRESSION");
            $J.expect(exp.args[1].type).toEqual("EXPRESSION");
            $J.expect(exp.pos).toEqual(21);
          });
        });
      });

      $J.describe("if - elseif - end", function () {
        $J.describe("creates an array for evaluation and stores it in exec array", function () {
          $J.it("should have exec[0] and exec[1] as array of expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n elseif 4 ~= 5 \n y = 4 \n end";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.exec[0].length).toEqual(2);
            $J.expect(exp.exec[1].length).toEqual(1);
            $J.expect(exp.pos).toEqual(24);
          });

          $J.it("should have args[0] and args[1] as single expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n elseif 4 ~= 5 \n y = 4 \n end";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.args[0].type).toEqual("EXPRESSION");
            $J.expect(exp.args[1].type).toEqual("EXPRESSION");
            $J.expect(exp.pos).toEqual(24);
          });
        });
      });

      $J.describe("if - elseif - elseif - else - end", function () {
        $J.describe("creates an array for evaluation and stores it in exec array", function () {
          $J.it("should have exec[0], exec[1], exec[2], exec[3] as array of expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n elseif 4 ~= 5 \n y = 4 \n elseif 6 > 7 && 1 < 2 \n z = 3\n else \n butts = 4; end";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.exec.length).toEqual(4);
            $J.expect(exp.exec[0].length).toEqual(2);
            $J.expect(exp.exec[1].length).toEqual(1);
            $J.expect(exp.exec[2].length).toEqual(1);
            $J.expect(exp.exec[3].length).toEqual(1);
          });

          $J.it("should have args[0], args[1], args[3], args[3] as single expressions", function () {
            var input = "if 4 >= 5 \n x = 3; \n y = 10 \n elseif 4 ~= 5 \n y = 4 \n elseif 6 > 7 && 1 < 2 \n z = 3\n else \n butts = 4; end";
            var args = parser.preprocess(input);
            var exp = new If(args, 0, null, parser.operators);
            $J.expect(exp.exec.length).toEqual(4);
            $J.expect(exp.args[0].type).toEqual("EXPRESSION");
            $J.expect(exp.args[1].type).toEqual("EXPRESSION");
            $J.expect(exp.args[2].type).toEqual("EXPRESSION");
            $J.expect(exp.args[3].type).toEqual("EXPRESSION");
          });
        });
      });
    });

    $J.describe("#interpret(variables, outputCallback)", function () {
      $J.describe("correctly handles cases if - elseif - elseif - else - end", function () {

        var exp = null;
        var spy0 = null;
        var spy1 = null;
        var spy2 = null;
        var spy3 = null;
        var callbackSpy = null;
        var opts = {};
        $J.beforeEach(function () {
          var input = "if x >= 10 \n y = 1; \n z = 1;\n" + "elseif x == 9 \n y = 2 \n z = 2;\n" + "elseif x < 9 && x > 4 \n y = 3\n z = 3;\n" + "else \n y = 4;  z = 4;\n end";
          var args = parser.preprocess(input);
          exp = new If(args, 0, null, parser.operators);

          spy0 = sinon.spy(exp.exec[0][0], "interpret");
          spy1 = sinon.spy(exp.exec[1][0], "interpret");
          spy2 = sinon.spy(exp.exec[2][0], "interpret");
          spy3 = sinon.spy(exp.exec[3][0], "interpret");
          callbackSpy = sinon.spy(parser, "outputCallback");
          opts = {};
          opts.outputCallback = function () {
          }
        });

        $J.afterEach(function () {
          spy0.restore();
          spy1.restore();
          spy2.restore();
          spy3.restore();
          callbackSpy.restore();
        });

        $J.it("should handle `if` case", function (done) {


          opts.variables = {
            "x": [
              [10]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(spy0.callCount).toEqual(1);
            $J.expect(spy1.callCount).toEqual(0);
            $J.expect(spy2.callCount).toEqual(0);
            $J.expect(spy3.callCount).toEqual(0);

            $J.expect(opts.variables["y"]).toEqual([
              [1]
            ]);
            $J.expect(opts.variables["z"]).toEqual([
              [1]
            ]);
            done();
          });
        });

        $J.it("should handle `elseif` case", function (done) {

          opts.variables = {
            "x": [
              [9]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(spy0.callCount).toEqual(0);
            $J.expect(spy1.callCount).toEqual(1);
            $J.expect(spy2.callCount).toEqual(0);
            $J.expect(spy3.callCount).toEqual(0);

            $J.expect(opts.variables["y"]).toEqual([
              [2]
            ]);
            $J.expect(opts.variables["z"]).toEqual([
              [2]
            ]);
            done();
          });
        });

        $J.it("should handle second `elseif` case", function (done) {

          opts.variables = {
            "x": [
              [5]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(spy0.callCount).toEqual(0);
            $J.expect(spy1.callCount).toEqual(0);
            $J.expect(spy2.callCount).toEqual(1);
            $J.expect(spy3.callCount).toEqual(0);

            $J.expect(opts.variables["y"]).toEqual([
              [3]
            ]);
            $J.expect(opts.variables["z"]).toEqual([
              [3]
            ]);
            done();
          });
        });

        $J.it("should handle `else` case", function (done) {

          opts.variables = {
            "x": [
              [1]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(spy0.callCount).toEqual(0);
            $J.expect(spy1.callCount).toEqual(0);
            $J.expect(spy2.callCount).toEqual(0);
            $J.expect(spy3.callCount).toEqual(1);

            $J.expect(opts.variables["y"]).toEqual([
              [4]
            ]);
            $J.expect(opts.variables["z"]).toEqual([
              [4]
            ]);
            done();
          });
        });
      });

      $J.describe("correctly handles matrix test args", function () {

        var exp = null;
        var opts = null;
        $J.beforeEach(function () {
          var input = "if x >= 10 y = 1," + "else y = 4, end";
          var args = parser.preprocess(input);
          exp = new If(args, 0, null, parser.operators);
          opts = {};
          opts.outputCallback = function () {
          }
        });

        $J.it("should handle all true case", function (done) {

          opts.variables = {
            "x": [
              [10, 10, 10],
              [11, 11, 11]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(opts.variables["y"]).toEqual([
              [1]
            ]);
            done();
          });
        });

        $J.it("should handle all false case", function (done) {

          opts.variables = {
            "x": [
              [9, 9, 9],
              [8, 8, 8]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(opts.variables["y"]).toEqual([
              [4]
            ]);
            done();
          });
        });

        $J.it("should consider 1 false as false", function (done) {

          opts.variables = {
            "x": [
              [10, 9, 10],
              [11, 11, 11]
            ]
          };
          exp.interpret(opts, function (err, ans) {
            $J.expect(opts.variables["y"]).toEqual([
              [4]
            ]);
            done();
          });
        });
      });
    });

    $J.describe("integrates with the parser", function () {
      $J.it("should be in the script", function (done) {
        var input = "x = 5; \nif x >= 5 \n x = 3; \n end\n";
        parser.evaluate(input, function (err, ans) {
          $J.expect(ans).toBeTruthy();
          done();
        });
      });

      $J.it("should nest fine", function (done) {
        var input = "x = 5; \n" + "if x >= 5 \n" + "x = 3; \n" + "if(x == 3)\n" + " y = 4\n" + "end\n" + "end\n";
        parser.evaluate(input, function (err, ans) {
          $J.expect(ans).toBeTruthy();
          $J.expect(ans[2].name).toEqual("y");
          $J.expect(ans[2].ans).toEqual([
            [4]
          ]);
          done();
        });
      });

      $J.it("should nest fine", function (done) {
        var input = "x = 5; \n" + "if x >= 5 \n" + "x = 6; \n" + "if(x == 3)\n" + " y = 4\n" + "else\n" + "y = 10\n" + "end\n" + "end\n";
        parser.evaluate(input, function (err, ans) {
          $J.expect(ans).toBeTruthy();
          $J.expect(ans[2].name).toEqual("y");
          $J.expect(ans[2].ans).toEqual([
            [10]
          ]);
          done();
        });
      });

      $J.it("should nest fine", function (done) {
        var input = "x = 3; \n" + "if x >= 5 \n" + "x = 6; \n" + "else\n" + "if(x == 3)\n" + " y = 4\n" + "else\n" + "y = 10\n" + "end\n" + "end\n";
        parser.evaluate(input, function (err, ans) {
          $J.expect(ans).toBeTruthy();
          $J.expect(ans[1].name).toEqual("y");
          $J.expect(ans[1].ans).toEqual([
            [4]
          ]);
          done();
        });
      });
    });
  });

});