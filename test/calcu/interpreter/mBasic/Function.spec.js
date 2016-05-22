define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mBasic/Function",
  "sinon"
], function ($J, Matchers, CommandParser, Function, sinon) {


  var epsilon;

  $J.describe("cali.calcu.interpreter.mBasic.Function", function () {

    // setup the environment
    var parser = null; // the parser

    $J.beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    $J.it("should exist in the namespace", function () {
      $J.expect(typeof Function).toEqual("function");
    });

    $J.describe("new Function(input, position, parent, operators)", function () {
      var exp;
      $J.describe("correctly defines the name, inputs, outputs, and inserts it into the operators", function () {

        $J.beforeEach(function (done) {
          parser.operators.getFunction("butts", function (err, item) {
            // expect(item).toBeFalsy();
            done();
          });
        });

        $J.afterEach(function (done) {
          parser.operators.getFunction("butts", function (err, item) {
            // expect(item).toBeTruthy();
            done();
          });
        })

        $J.describe("when no output or input specified", function () {

          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function butts\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(0);
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function butts\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(0);
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
        });

        $J.describe("when single output in parens and no input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x] = butts\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(1);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
          $J.describe("without an `end` argument", function () {
            it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x] = butts\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(1);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when multiple output in parens and no input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x, y] = butts\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(2);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.outputVars[1]).toEqual("y");
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x, y] = butts\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(2);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.outputVars[1]).toEqual("y");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when multiple output in parens and 1 input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x, y] = butts(zz)\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(1);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.outputVars.length).toEqual(2);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.outputVars[1]).toEqual("y");
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x, y] = butts(zz)\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(1);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.outputVars.length).toEqual(2);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.outputVars[1]).toEqual("y");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when no output and 1 input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function butts(zz)\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(1);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.outputVars.length).toEqual(0);
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function butts(zz)\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(1);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.outputVars.length).toEqual(0);
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when no output and 2 input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function butts(zz, pp)\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(2);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.inputVars[1]).toEqual("pp");
              $J.expect(exp.outputVars.length).toEqual(0);
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function butts(zz, pp)\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(2);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.inputVars[1]).toEqual("pp");
              $J.expect(exp.outputVars.length).toEqual(0);
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when multiple output in parens and 2 input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x, y] = butts(zz, pp)\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(2);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.inputVars[1]).toEqual("pp");
              $J.expect(exp.outputVars.length).toEqual(2);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.outputVars[1]).toEqual("y");
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function [x, y] = butts(zz, pp)\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(2);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.inputVars[1]).toEqual("pp");
              $J.expect(exp.outputVars.length).toEqual(2);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.outputVars[1]).toEqual("y");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when a single output (without parens) and no input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function x = butts\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(1);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLines`", function () {
              input = "function x = butts\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(0);
              $J.expect(exp.outputVars.length).toEqual(1);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
        });

        $J.describe("when a single output (without parens) and 1 input specified", function () {
          $J.describe("with an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLinesLines`", function () {
              input = "function x = butts(zz)\n x = 1; \ny = 2; \nend";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(1);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.outputVars.length).toEqual(1);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.execLines.length).toEqual(2);
            });

          });
          $J.describe("without an `end` argument", function () {
            $J.it("should have correct `name`, `inputArgs`, `outputArgs`, and `execLinesLines`", function () {
              input = "function x = butts(zz)\n x = 1; \ny = 2; \n";
              var args = parser.preprocess(input);
              exp = new Function(args, 0, null, parser.operators);
              $J.expect(exp.name).toEqual("butts");
              $J.expect(exp.inputVars.length).toEqual(1);
              $J.expect(exp.inputVars[0]).toEqual("zz");
              $J.expect(exp.outputVars.length).toEqual(1);
              $J.expect(exp.outputVars[0]).toEqual("x");
              $J.expect(exp.execLines.length).toEqual(2);
            });
          });
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

      $J.describe("returns null, null", function () {
        var exp = null;

        function callback(output) {

        }

        $J.beforeEach(function () {
          var input = "function x = butts(zz)\n x = 1; \ny = 2; \n";
          var args = parser.preprocess(input);
          exp = new Function(args, 0, null, parser.operators);
          opts.variables = {};
          opts.outputCallback = callback;
        });

        $J.it("should not do anything", function (done) {
          exp.interpret(opts, function (err, ans) {
            $J.expect(err).toEqual(null);
            $J.expect(ans).toEqual(null)
            done();
          });
        });
      });
    });

    $J.describe("#execute", function () {
      var evalSpy = [];
      var exp;
      $J.beforeEach(function () {
        var input = "function [x, z] = butts(x, y)\n z = 4; \nx = x + 1; \ny = 2; \nend";
        var args = parser.preprocess(input);
        exp = new Function(args, 0, null, parser.operators);
        for (var i = 0; i < exp.execLines.length; i++) {
          evalSpy.push(sinon.spy(exp.execLines[i], "interpret"));
        }
      });

      $J.afterEach(function () {
        for (var i = 0; i < evalSpy.length; i++) {
          evalSpy[i].restore();
        }
        evalSpy = [];
      });

      $J.it("should exist", function () {
        $J.expect(typeof exp.execute).toEqual("function");
      });

      $J.describe("that is called similarly to a calcu-module function", function () {

        $J.it("should be async", function () {
          $J.expect(exp.execute.async).toEqual(true);
        });

        $J.describe("when executed with arrays as input args", function () {
          var outputArgs, done;
          $J.beforeEach(function (done) {

            exp.execute([
              [1]
            ], [
              [2]
            ], function () {
              outputArgs = arguments;
              done();
            });
          });

          $J.describe("calls `execLines.interpret(opts, callback)`", function () {

            $J.it("should call each execLine", function () {
              for (var i in evalSpy) {
                $J.expect(evalSpy[i].callCount).toEqual(1);
              }
            });

            $J.it("should call with `opt.variables`", function () {
              for (var i in evalSpy) {
                $J.expect(evalSpy[0].args[0][0].variables).toEqual({
                  "z": [
                    [4]
                  ],
                  "x": [
                    [2]
                  ],
                  "y": [
                    [2]
                  ]
                });
              }
            });

            $J.it("should call with `opt.outputCallback`", function () {
              for (var i in evalSpy) {
                $J.expect(typeof evalSpy[0].args[0][0].outputCallback).toEqual("function");
              }
            });

            it("should call the callback with the output variables in order", function () {
              $J.expect(outputArgs.length).toEqual(3);
              $J.expect(outputArgs[0]).toBeFalsy();
              $J.expect(outputArgs[1]).toEqual([
                [2]
              ]);
            });
          });
        });
      });
    });

  });

});
