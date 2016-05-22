define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mBasic/Line",
  "sinon"
], function ($J, Matchers, CommandParser, Line, sinon) {

  $J.describe("cali.calcu.interpreter.mBasic.Line", function () {

    // setup the environment
    var parser = null;
    $J.beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    $J.describe("new Line(input, position, parent, operators)", function () {

      $J.describe("handles the arguments to the first new line char", function () {
        $J.it("should fill one line", function () {
          var input = "x = 3; \n y = 4;";
          var args = parser.preprocess(input);
          var line = new Line(args, 0, null, parser.operators);
          $J.expect(line.getFinalPosition()).toEqual(4);
        });
      });

      $J.describe("adds expressions to an array until the new line", function () {
        $J.it("should contain 1 expression", function () {
          var input = "x = 3; \n y = 4;";
          var args = parser.preprocess(input);
          var line = new Line(args, 0, null, parser.operators);
          expect(line.args.length).toEqual(1);
          expect(line.args[0].type).toEqual("EXPRESSION");
        });

        $J.it("should contain 2 expressions", function () {
          var input = "x = 3, y = 4; \n";
          var args = parser.preprocess(input);
          var line = new Line(args, 0, null, parser.operators);
          $J.expect(line.args.length).toEqual(2);
          $J.expect(line.args[0].type).toEqual("EXPRESSION");
          $J.expect(line.args[1].type).toEqual("EXPRESSION");
        });
      });

    });

    $J.describe("#interpret(variables)", function () {
      var spy = null;
      $J.beforeEach(function () {
        spy = sinon.spy(parser, "outputCallback");
      });
      $J.afterEach(function () {
        spy.restore();
      });

      $J.describe("calls interpret on each expression in the line", function () {
        $J.it("should call interpret once", function (done) {
          var input = "x = 3; \n y = 4;";
          var args = parser.preprocess(input);
          var line = new Line(args, 0, null, parser.operators);
          sinon.spy(line.args[0], "interpret");
          var opts = {variables: parser.variables, outputCallback: parser.outputCallback};
          line.interpret(opts, function (err, ans) {
            $J.expect(line.args[0].interpret.callCount).toEqual(1);
            $J.expect(line.args[0].interpret.getCall(0).args[0]).toEqual(opts);
            $J.expect(typeof line.args[0].interpret.getCall(0).args[1]).toEqual("function");
            $J.expect(spy.callCount).toEqual(2);
            $J.expect(spy.getCall(0).args[0]).toEqual("lines");
            $J.expect(spy.getCall(0).args[1]).toEqual({
              start: 0,
              length: 1
            });
            $J.expect(spy.getCall(1).args[0]).toEqual("result");
            $J.expect(spy.getCall(1).args[1]).toEqual({
              ans: [
                [3]
              ],
              name: "x"
            });
            done();
          });
        });

        $J.it("should call interpret twice", function (done) {
          var input = "x = 3, y = 4;";
          var args = parser.preprocess(input);
          var line = new Line(args, 0, null, parser.operators);
          sinon.spy(line.args[0], "interpret");
          sinon.spy(line.args[1], "interpret");
          var opts = {variables: parser.variables, outputCallback: parser.outputCallback};
          line.interpret(opts, function (err, ans) {
            $J.expect(line.args[0].interpret.callCount).toEqual(1);
            $J.expect(line.args[0].interpret.getCall(0).args[0]).toEqual(opts);
            $J.expect(typeof line.args[0].interpret.getCall(0).args[1]).toEqual("function");

            $J.expect(line.args[1].interpret.callCount).toEqual(1);
            $J.expect(line.args[1].interpret.getCall(0).args[0]).toEqual(opts);
            $J.expect(typeof line.args[1].interpret.getCall(0).args[1]).toEqual("function");

            $J.expect(spy.callCount).toEqual(3);
            $J.expect(spy.getCall(0).args[0]).toEqual("lines");
            $J.expect(spy.getCall(0).args[1]).toEqual({
              start: 0,
              length: 1
            });
            $J.expect(spy.getCall(1).args[0]).toEqual("result");
            $J.expect(spy.getCall(1).args[1]).toEqual({
              ans: [
                [3]
              ],
              name: "x"
            });

            $J.expect(spy.getCall(2).args[0]).toEqual("result");
            $J.expect(spy.getCall(2).args[1]).toEqual({
              ans: [
                [4]
              ],
              name: "y"
            });
            done();
          });
        });
      });
    });
  });

});