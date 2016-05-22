define([
    "sinon",
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "cali-calcu/interpreter/mBasic/Script",
  "cali-calcu/interpreter/mBasic/Line"
], function (sinon, $J, Matchers, CommandParser, Script, Line) {

  describe("cali.calcu.interpreter.mBasic.Script", function () {

    // setup the environment
    var parser = new CommandParser();
    beforeEach(function () {
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    describe("new Script(input, position, parent, operators)", function () {
      it("creates a new Line arg with each new line", function () {
        var input = "x = 3; \n y = 4;";
        var args = parser.preprocess(input);
        var script = new Script(args, 0, null, parser.operators);
        expect(script.args.length).toEqual(2);
        expect(script.args[0].type).toEqual("LINE");
        expect(script.args[1].type).toEqual("LINE");
      });
    });

    describe("#interpret(variables)", function () {
      var spy = null;
      beforeEach(function () {
        spy = sinon.spy(Line.prototype, "interpret");
      });
      afterEach(function () {
        spy.restore();
      });
      describe("interpret each line", function () {
        it("should call interpret on every argument", function (done) {
          var input = "x = 3; \n y = 4;";
          var args = parser.preprocess(input);
          var script = new Script(args, 0, null, parser.operators);
          script.interpret(parser, function (err, ans) {
            expect(spy.callCount).toEqual(2);
            done();
          });

        });
      });
    });


      $J.describe("#120: unnested infix notation inside function arguments", function () {

          var callbackSpy;
          beforeEach(function () {
              callbackSpy = sinon.spy(parser, "outputCallback");
          });

          afterEach(function(){
              parser.outputCallback.restore();
          });

          [
              "size((ones(4, 5) + zeros(4, 5)))",
              "size(ones(4, 5) + zeros(4, 5))",
              "size((ones(4, 5) - zeros(4, 5)))",
              "size(ones(4, 5) - zeros(4, 5))"
          ].forEach(function (command) {
                  $J.it(command + ": should not throw", function (done) {
                      var tokens = parser.preprocess(command);
                      var script = new Script(tokens, 0, null, parser.operators);
                      script.interpret(parser, function (err, ans) {
                          expect(err).toBeFalsy();
                          expect(callbackSpy.args[1][1].ans[0]).toEqual([4,5]);
                          done();
                      });
                  });
              });

    });

  });

});