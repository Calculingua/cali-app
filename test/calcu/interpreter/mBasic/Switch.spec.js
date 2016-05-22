define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mBasic/Switch"
], function ($J, Matchers, CommandParser, Switch) {

  $J.describe("cali.calcu.interpreter.mBasic.Switch", function () {

    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    it("should exist in the namespace", function () {
      expect(typeof Switch).toEqual("function");
    });

    describe("new Switch(input, position, parent, operators)", function () {

      var exp = null;
      beforeEach(function () {
        var input = "switch 5+3 \n case 2\n x = 1 \n y = 1; \ncase 8\n x = 2 \n y = ones(3)\n otherwise\n x = 3\n end\n";
        var args = parser.preprocess(input);
        exp = new Switch(args, 0, null, parser.operators);
      });

      describe("stores the switch and case statements inside `args`", function () {

        describe("places `switch` expression in first `arg` element", function () {
          it("should have arg[0] as an expression", function () {
            expect(exp.args[0].type).toEqual("EXPRESSION");
          });
        });

        describe("places `case` statements into subsequent `arg` elements", function () {
          it("should have arg[1] and arg[2] as an expression", function () {
            expect(exp.args[1].type).toEqual("EXPRESSION");
            expect(exp.args[2].type).toEqual("EXPRESSION");
          });
        });

        describe("places `otherwise` statements into last `arg` element", function () {
          it("should have arg[3] as a dummy expression", function () {
            expect(exp.args[3].type).toEqual("EXPRESSION");
            expect(exp.args[3]).toEqual(exp.args[0]);
          });
        });
      });

      describe("stores the program statements inside `exec`", function () {
        describe("exec[0] should be empty because it is associated with the switch", function () {
          it("should have exec[0] with length = 0", function () {
            expect(exp.exec[0].length).toEqual(0);
          });
        });

        describe("places subsequent case statement's statements inside exec[1], exec[2], ...", function () {
          it("should have full exec[]", function () {
            expect(exp.exec.length).toEqual(4);
            expect(exp.exec[1].length).toEqual(2);
            expect(exp.exec[2].length).toEqual(2);
            expect(exp.exec[3].length).toEqual(1);
          });
        });
      });
    });

    describe("#interpret(variables, outputCallback)", function () {

      describe("correctly executes the statements associated with the correct case", function () {

        var exp = null;
        var variables = {};
        var spy1_0 = null;
        var spy1_1 = null;
        var spy2_0 = null;
        var spy2_1 = null;
        var spy3_0 = null;
        beforeEach(function () {
          var input = "switch x+3 \n case 2\n x = 1 \n y = 1; \ncase 8\n x = 2 \n y =4\n otherwise\n x = 3\n end\n";
          var args = parser.preprocess(input);
          exp = new Switch(args, 0, null, parser.operators);
          spy1_0 = sinon.spy(exp.exec[1][0], "interpret");
          spy1_1 = sinon.spy(exp.exec[1][1], "interpret");
          spy2_0 = sinon.spy(exp.exec[2][0], "interpret");
          spy2_1 = sinon.spy(exp.exec[2][1], "interpret");
          spy3_0 = sinon.spy(exp.exec[3][0], "interpret");
        });

        afterEach(function () {
          spy1_0.restore();
          spy1_1.restore();
          spy2_0.restore();
          spy2_1.restore();
          spy3_0.restore();
        });

        it("should execute correct case statements", function (done) {
          variables = {
            "x": [
              [-1]
            ]
          };
          var opts = {
            variables: variables,
            outputCallback: function () {
            }
          };
          exp.interpret(opts, function (err, ans) {
            expect(spy1_0.callCount).toEqual(1);
            expect(spy1_1.callCount).toEqual(1);
            expect(spy2_0.callCount).toEqual(0);
            expect(spy2_1.callCount).toEqual(0);
            expect(spy3_0.callCount).toEqual(0);
            expect(variables.x).toEqual([
              [1]
            ]);
            expect(variables.y).toEqual([
              [1]
            ]);
            done();
          });
        });

        it("should execute correct case statements", function (done) {
          variables = {
            "x": [
              [5]
            ]
          };
          var opts = {
            variables: variables,
            outputCallback: function () {
            }
          };
          exp.interpret(opts, function (err, ans) {
            expect(spy1_0.callCount).toEqual(0);
            expect(spy1_1.callCount).toEqual(0);
            expect(spy2_0.callCount).toEqual(1);
            expect(spy2_1.callCount).toEqual(1);
            expect(spy3_0.callCount).toEqual(0);
            expect(variables.x).toEqual([
              [2]
            ]);
            expect(variables.y).toEqual([
              [4]
            ]);
            done();
          });
        });

        it("should execute correct case statements", function (done) {
          variables = {
            "x": [
              [6]
            ]
          };
          var opts = {
            variables: variables,
            outputCallback: function () {
            }
          };
          exp.interpret(opts,
            function (err, ans) {
              expect(spy1_0.callCount).toEqual(0);
              expect(spy1_1.callCount).toEqual(0);
              expect(spy2_0.callCount).toEqual(0);
              expect(spy2_1.callCount).toEqual(0);
              expect(spy3_0.callCount).toEqual(1);
              expect(variables.x).toEqual([
                [3]
              ]);
              expect(variables.y).toBeFalsy();
              done();
            });
        });
      });

      describe("throws an error when the switch and case statement don't evaluate correctly", function () {
        it("should throw when switch expression is a numeric matrix", function (done) {
          var input = "switch x = ones(3) \n case 2\n x = 1 \n y = 1; \ncase 8\n x = 2 \n y = ones(3)\n otherwise\n x = 3\n end\n";
          var args = parser.preprocess(input);
          exp = new Switch(args, 0, null, parser.operators);
          var opts = {
            variables: {},
            outputCallback: function () {
            }
          };
          exp.interpret(opts, function (err, ans) {
            expect(err).toEqual("Operator Error :: SWITCH : switch expression should be a scalar or string.");
            done();
          });
        });

        it("should throw when case expression is a numeric matrix", function (done) {
          var input = "switch 1 \n case [3, 4]\n x = 1 \n y = 1; \ncase 8\n x = 2 \n y = ones(3)\n otherwise\n x = 3\n end\n";
          var args = parser.preprocess(input);
          exp = new Switch(args, 0, null, parser.operators);
          var opts = {
            variables: {},
            outputCallback: function () {
            }
          };
          exp.interpret(opts, function (err, ans) {
            expect(err).toEqual("Operator Error :: SWITCH : case expression should be a scalar, string, or cell array of scalars or strings.");
            done();
          });
        });
      });

    });

    describe("integrates with the parser", function () {
      it("should be in the script", function (done) {
        var input = "x = 5; \nswitch x+3 \n case 2\n x = 1 \n y = 1; \ncase 8\n x = 2 \n y = ones(3)\n otherwise\n x = 3\n end\n";
        parser.evaluate(input, function (err, ans) {
          expect(ans).toBeTruthy();
          done();
        });

      });

      it("should nest correctly", function (done) {
        var input = "x = 5; \nswitch x+3 \n " + "case 2\n x = 1 \n y = 1; \n" + "case 8\n x = 2 \n" + "switch x\n case 4\n z = 3\n case 2, z = 1\n end" + "y = [1, 1, 1; 1, 1, 1;1, 1, 1]\n " + "otherwise\n x = 3\n " + "end\n";
        parser.evaluate(input, function (err, ans) {
          expect(parser.variables.z).toEqual([
            [1]
          ]);
          expect(parser.variables.y).toEqual([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
          ]);
          done();
        });

      });

    });

  });

});