define([
  "$J",
  "sinon",
  "cali-calcu/interpreter/mBasic/Expression",
  "cali-calcu/CommandParser",
  "../../dev/Matchers"
], function ($J, sinon, Expression, CommandParser, Matchers) {


  $J.describe("cali.interpreter.mBasic.Expression", function () {

    // setup the environment
    var parser = null;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    $J.describe("new Expression(input, position, parent, operators)", function () {

      $J.describe("handles the arguments", function () {
        $J.it("should fill one set of arguments and set printflag to false", function () {
          var input = "3;";
          var args = parser.preprocess(input);
          var exp = new Expression(args, 0, null, parser.operators);
          $J.expect(exp.getFinalPosition()).toEqual(2);
          $J.expect(exp.printFlag).toEqual(false);
        });

        $J.it("should fill one set of arguments and set printflag to true", function () {
          var input = "3";
          var args = parser.preprocess(input);
          var exp = new Expression(args, 0, null, parser.operators);
          $J.expect(exp.getFinalPosition()).toEqual(1);
          $J.expect(exp.printFlag).toEqual(true);
        });

        $J.it("should fill one set of arguments and set printflag to false", function () {
          var input = "x = 3;";
          var args = parser.preprocess(input);
          var exp = new Expression(args, 0, null, parser.operators);
          $J.expect(exp.getFinalPosition()).toEqual(4);
          $J.expect(exp.printFlag).toEqual(false);
        });

        $J.it("should fill one set of arguments and set printflag to true", function () {
          var input = "x = 3 \n z = 4;";
          var args = parser.preprocess(input);
          var exp = new Expression(args, 0, null, parser.operators);
          $J.expect(exp.getFinalPosition()).toEqual(3);
          $J.expect(exp.printFlag).toEqual(true);
        });

        $J.it("should fill one set of arguments and set printflag to true", function () {
          var input = "x = 3, y = 4";
          var args = parser.preprocess(input);
          var exp = new Expression(args, 0, null, parser.operators);
          $J.expect(exp.getFinalPosition()).toEqual(4);
          $J.expect(exp.printFlag).toEqual(true);
        });
      });

      $J.describe("handles multiple output arguments to a function", function () {
        $J.it("should have two outputs", function () {
          var input = "[exx, wyy] = butts();";
          var args = parser.preprocess(input);
          var exp = new Expression(args, 0, null, parser.operators);
          $J.expect(exp.output.length).toEqual(2);
          $J.expect(exp.output[0]).toEqual("exx");
          $J.expect(exp.output[1]).toEqual("wyy");
        });
      });
    });

    $J.describe("#interpret(opts, callback)", function () {
      $J.describe("calls interpret on the args and prints when appropriate", function () {
        var cb = null;
        $J.beforeEach(function () {
          cb = sinon.spy(parser, "outputCallback");
        });

        $J.afterEach(function () {
          cb.restore();
        });

        $J.describe("when there is not a variable name assigned", function () {

          $J.describe("with a trailing semicolon", function () {
            $J.it("should call outputCallback for variable `ans` with print set to false", function (done) {
              var input = "3;";
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                $J.expect(cb.callCount).toEqual(1);
                $J.expect(cb.getCall(0).args[0]).toEqual("result");
                $J.expect(cb.getCall(0).args[1]).toEqual({
                  name: "ans",
                  ans: [
                    [3]
                  ]
                });
                $J.expect(cb.getCall(0).args[2]).toEqual(false);
                done()
              });
            });
          });

          $J.describe("with NO trailing semicolon", function () {
            $J.it("should call outputCallback for variable `ans` with print set to false", function (done) {
              var input = "3";
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                $J.expect(cb.callCount).toEqual(1);
                $J.expect(cb.getCall(0).args[0]).toEqual("result");
                $J.expect(cb.getCall(0).args[1]).toEqual({
                  name: "ans",
                  ans: [
                    [3]
                  ]
                });
                $J.expect(cb.getCall(0).args[2]).toEqual(true);
                done();
              });
            });
          });
        });

        $J.describe("when there is a variable name assigned", function () {

          $J.describe("with a trailing semicolon", function () {
            $J.it("should call outputCallback for variable with print set to false", function (done) {
              var input = "x = 3;";
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                $J.expect(cb.callCount).toEqual(1);
                $J.expect(cb.getCall(0).args[0]).toEqual("result");
                $J.expect(cb.getCall(0).args[1]).toEqual({
                  name: "x",
                  ans: [
                    [3]
                  ]
                });
                $J.expect(cb.getCall(0).args[2]).toEqual(false);
                done()
              });
            });
          });

          $J.describe("with NO trailing semicolon", function () {
            $J.it("should call outputCallback for variable with print set to false", function (done) {
              var input = "x = 3";
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                $J.expect(cb.callCount).toEqual(1);
                $J.expect(cb.getCall(0).args[0]).toEqual("result");
                $J.expect(cb.getCall(0).args[1]).toEqual({
                  name: "x",
                  ans: [
                    [3]
                  ]
                });
                $J.expect(cb.getCall(0).args[2]).toEqual(true);
                done()
              });
            });
          });


        });

        $J.describe("when the variable has a row and column specified", function () {
          $J.describe("with a single indices and scalar value", function () {
            $J.it("should modify the variable", function (done) {
              var input = "x(2,2) = 3";
              parser.variables = {
                "x": [
                  [1, 2, 3],
                  [4, 5, 6]
                ]
              };
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                $J.expect(parser.variables.x).toEqual([
                  [1, 2, 3],
                  [4, 3, 6]
                ]);
                done();
              });

            });
          });

          $J.describe("when the index is one longer than the current length", function () {
            $J.it("should be okay with row additions", function (done) {

              var input = "x(3,1) = 3";
              parser.variables = {
                "x": [
                  [1],
                  [4]
                ]
              };
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                expect(parser.variables.x).toEqual([
                  [1],
                  [4],
                  [3]
                ]);
                done();
              });
            });

            $J.it("should be okay with column additions", function (done) {


              var input = "x(1, 3) = 3";
              parser.variables = {
                "x": [
                  [1, 2]
                ]
              };
              var args = parser.preprocess(input);
              var exp = new Expression(args, 0, null, parser.operators);
              exp.interpret(parser, function (err, ans) {
                $J.expect(parser.variables.x).toEqual([
                  [1, 2, 3]
                ]);
                done();
              });
            });
          });
        });

        $J.describe("when it's a comment", function () {

          $J.it("should call outputCallback for comment", function (done) {
            var input = "% # butts";
            var args = parser.preprocess(input);
            var exp = new Expression(args, 0, null, parser.operators);
            exp.interpret(parser, function (err, ans) {
              $J.expect(cb.callCount).toEqual(1);
              $J.expect(cb.getCall(0).args[0]).toEqual("comment");
              $J.expect(cb.getCall(0).args[1]).toEqual("# butts\n");
              done()
            });
          });
        });

        $J.describe("for functions that return three outputs", function () {
            $J.describe("[exx, why, here] = butts();", function(){
                var exp;
                $J.beforeEach(function () {
                  var input = "[exx, why, here] = butts();";
                  var args = parser.preprocess(input);
                  exp = new Expression(args, 0, null, parser.operators);
                  sinon.stub(exp.args[0], "interpret", function (opts, callback) {
                    callback(null, [[3]], [[4]], [[5]]);
                  });
                });

                $J.it("should return three outputs", function (done) {
                  exp.interpret(parser, function (err, ans0, ans1, ans2) {
                    $J.expect(err).toEqual(null);
                    $J.expect(ans0).toEqual([[3]]);
                    $J.expect(ans1).toEqual([[4]]);
                    $J.expect(ans2).toEqual([[5]]);
                    done();
                  });
                });

                $J.it("should call `parser.outputCallback` three times", function (done) {
                  exp.interpret(parser, function (err, ans0, ans1, ans2) {
                    $J.expect(cb.callCount).toEqual(3);
                    $J.expect(cb.getCall(0).args[0]).toEqual("result");
                    $J.expect(cb.getCall(0).args[1]).toEqual({name: "exx", ans: [[3]]});
                    $J.expect(cb.getCall(1).args[0]).toEqual("result");
                    $J.expect(cb.getCall(1).args[1]).toEqual({name: "why", ans: [[4]]});
                    $J.expect(cb.getCall(2).args[0]).toEqual("result");
                    $J.expect(cb.getCall(2).args[1]).toEqual({name: "here", ans: [[5]]});
                    done()
                  });
                });
            });
            
            $J.describe("[exx, why] = butts();", function(){
                var exp;
                $J.beforeEach(function () {
                  var input = "[exx, why] = butts();";
                  var args = parser.preprocess(input);
                  exp = new Expression(args, 0, null, parser.operators);
                  sinon.stub(exp.args[0], "interpret", function (opts, callback) {
                    callback(null, [[3]], [[4]], [[5]]);
                  });
                });

                $J.it("should return three outputs", function (done) {
                  exp.interpret(parser, function (err, ans0, ans1, ans2) {
                    $J.expect(err).toEqual(null);
                    $J.expect(ans0).toEqual([[3]]);
                    $J.expect(ans1).toEqual([[4]]);
                    $J.expect(ans2).toEqual([[5]]);
                    done();
                  });
                });

                $J.it("should call `parser.outputCallback` two times", function (done) {
                  exp.interpret(parser, function (err, ans0, ans1, ans2) {
                    $J.expect(cb.callCount).toEqual(2);
                    $J.expect(cb.getCall(0).args[0]).toEqual("result");
                    $J.expect(cb.getCall(0).args[1]).toEqual({name: "exx", ans: [[3]]});
                    $J.expect(cb.getCall(1).args[0]).toEqual("result");
                    $J.expect(cb.getCall(1).args[1]).toEqual({name: "why", ans: [[4]]});
                    done()
                  });
                });
            });
        });
      });
    });
  });

});
