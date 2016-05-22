define([
  "$J",
  "sinon",
  "cali-calcu/CommandParser"
], function ($J, sinon, CommandParser) {

  $J.describe("CommandParser", function () {

    var parser = null;
    var model = {file: null, variables: {}};
    var controller = {};
    var view = {};
    var opts = null;
    $J.beforeEach(function () {
      parser = new CommandParser(opts, model, controller, view);
    });

    $J.it("should exist", function () {
      $J.expect(typeof CommandParser == "function").toBeTruthy();
    });

    $J.describe("#tokenize(input)", function () {

      $J.it("should exist", function () {
        $J.expect(typeof parser.tokenize == "function").toBeTruthy();
      });

      $J.describe("turns the command into an array of tokens", function () {

        $J.describe("comments", function () {

          $J.describe("that recognizes leading comment marker `%`", function () {
            $J.it("should find it at the front", function () {
              var cmd = "% # Comment";
              var tokens = parser.tokenize(cmd);
              $J.expect(tokens.length).toEqual(1);
              $J.expect(tokens[0].token).toEqual("% # Comment");
              $J.expect(tokens[0].index).toEqual(0);
            });

            $J.it("should find it in the middle", function () {
              var cmd = "x = 3; % # Comment";
              var tokens = parser.tokenize(cmd);
              $J.expect(tokens.length).toEqual(5);
              $J.expect(tokens[4].token).toEqual("% # Comment");
              $J.expect(tokens[4].index).toEqual(7);
            });
          });

        });

      });
    });

    $J.describe("#outputCallback(type, data, print)", function () {
      $J.it("should exist", function () {
        $J.expect(typeof parser.outputCallback == "function").toBeTruthy();
      });

      $J.describe("calls the event emitter with the contents of the call", function () {
        var emitter = null;
        $J.beforeEach(function () {
          emitter = sinon.spy(parser, "emit");
        });
        $J.afterEach(function () {
          emitter.restore();
        });

        $J.it("should call emitter", function () {
          parser.outputCallback("comment", "# butts", true);
          $J.expect(emitter.callCount).toEqual(1);
          $J.expect(emitter.getCall(0).args[0]).toEqual("comment");
          $J.expect(emitter.getCall(0).args[1]).toEqual("# butts");
          $J.expect(emitter.getCall(0).args[2]).toEqual(true);
        });
      });

      $J.describe("addes the `result` calls to an output variable", function () {
        $J.it("should add the variable onto the output", function () {
          parser.outputCallback("result", {
            name: "x",
            ans: [
              [ 3 ]
            ]
          }, true);
          $J.expect(parser.output).toEqual([
            {
              name: "x",
              ans: [
                [ 3 ]
              ]
            }
          ]);
        });
      });
    });

    $J.describe("#evaluate(input, [callback])", function () {

      $J.it("should exist", function () {
        $J.expect(typeof parser.evaluate == "function").toBeTruthy();
      });

      $J.describe("calls back with callback(err, answer)", function () {

        $J.describe("processes comments", function () {

          $J.describe("can handle comment lines", function () {

            $J.it("should not return a comment", function (done) {
              var cmd = "% # Comment";
              var ans = parser.evaluate(cmd, function (err, ans) {
                $J.expect(ans.length).toEqual(0);
                done();
              });
            });
          });

          $J.describe("can handle inline comments", function () {
            $J.it("should return only the result", function (done) {
              var cmd = "x = 3; % # Comment";
              parser.evaluate(cmd, function (err, ans) {
                $J.expect(ans.length).toEqual(1);
                done();
              });

            });
          });

        });

      });
    });

    $J.describe("#preprocess(input)", function () {
      $J.describe("tokenizes the input into a single array with line and column number", function () {

        $J.describe("handles single line scripts", function () {
          $J.it("should return an array with a trailing new line, when input has trailing new line", function () {
            var input = "x = 2;\n";
            var cmd = parser.preprocess(input);
            $J.expect(cmd[0]).toEqual({
              token: "x",
              index: 0,
              line: 0
            });
            $J.expect(cmd[1]).toEqual({
              token: "=",
              index: 2,
              line: 0
            });
            $J.expect(cmd[2]).toEqual({
              token: "2",
              index: 4,
              line: 0
            });
            $J.expect(cmd[3]).toEqual({
              token: ";",
              index: 5,
              line: 0
            });
            $J.expect(cmd[4]).toEqual({
              token: "\n",
              index: 6,
              line: 0
            });
          });

          $J.it("should return an array with a trailing new line, when input has no trailing new line", function () {
            var input = "x = 2;";
            var cmd = parser.preprocess(input);
            $J.expect(cmd[0]).toEqual({
              token: "x",
              index: 0,
              line: 0
            });
            $J.expect(cmd[1]).toEqual({
              token: "=",
              index: 2,
              line: 0
            });
            $J.expect(cmd[2]).toEqual({
              token: "2",
              index: 4,
              line: 0
            });
            $J.expect(cmd[3]).toEqual({
              token: ";",
              index: 5,
              line: 0
            });
            $J.expect(cmd[4]).toEqual({
              token: "\n",
              index: 6,
              line: 0
            });

          });
        });

        $J.describe("handles multi-line scripts.", function () {
          $J.it("should return an array with the second line indicated correctly", function () {
            var input = "x = 2; \n y  = 3;";
            var cmd = parser.preprocess(input);
            $J.expect(cmd.length).toEqual(10);
            $J.expect(cmd[0]).toEqual({
              token: "x",
              index: 0,
              line: 0
            });
            $J.expect(cmd[1]).toEqual({
              token: "=",
              index: 2,
              line: 0
            });
            $J.expect(cmd[2]).toEqual({
              token: "2",
              index: 4,
              line: 0
            });
            $J.expect(cmd[3]).toEqual({
              token: ";",
              index: 5,
              line: 0
            });
            $J.expect(cmd[4]).toEqual({
              token: "\n",
              index: 7,
              line: 0
            });
            $J.expect(cmd[5]).toEqual({
              token: "y",
              index: 1,
              line: 1
            });
            $J.expect(cmd[6]).toEqual({
              token: "=",
              index: 4,
              line: 1
            });
            $J.expect(cmd[7]).toEqual({
              token: "3",
              index: 6,
              line: 1
            });
            $J.expect(cmd[8]).toEqual({
              token: ";",
              index: 7,
              line: 1
            });
            $J.expect(cmd[9]).toEqual({
              token: "\n",
              index: 8,
              line: 1
            });
          });
        });

        $J.describe("handles multi-line scripts with line continuation", function () {
          $J.it("should return an array with the second line indicated correctly", function () {
            var input = "x = 2; \n y  = 3 ...\n + 2;";
            var cmd = parser.preprocess(input);
            $J.expect(cmd.length).toEqual(12);
            $J.expect(cmd[0]).toEqual({
              token: "x",
              index: 0,
              line: 0
            });
            $J.expect(cmd[5]).toEqual({
              token: "y",
              index: 1,
              line: 1
            });
            $J.expect(cmd[6]).toEqual({
              token: "=",
              index: 4,
              line: 1
            });
            $J.expect(cmd[7]).toEqual({
              token: "3",
              index: 6,
              line: 1
            });
            $J.expect(cmd[8]).toEqual({
              token: "+",
              index: 1,
              line: 2
            });
            $J.expect(cmd[9]).toEqual({
              token: "2",
              index: 3,
              line: 2
            });
            $J.expect(cmd[10]).toEqual({
              token: ";",
              index: 4,
              line: 2
            });
            $J.expect(cmd[11]).toEqual({
              token: "\n",
              index: 5,
              line: 2
            });
          });

          $J.it("should not remove `...` in middle of line", function () {
            var input = "x = 2; \n y  = 3 ... + 2;";
            var cmd = parser.preprocess(input);
            $J.expect(cmd.length).toEqual(13);
            $J.expect(cmd[0]).toEqual({
              token: "x",
              index: 0,
              line: 0
            });
            $J.expect(cmd[5]).toEqual({
              token: "y",
              index: 1,
              line: 1
            });
            $J.expect(cmd[6]).toEqual({
              token: "=",
              index: 4,
              line: 1
            });
            $J.expect(cmd[7]).toEqual({
              token: "3",
              index: 6,
              line: 1
            });
            $J.expect(cmd[8]).toEqual({
              token: "...",
              index: 8,
              line: 1
            });
            $J.expect(cmd[9]).toEqual({
              token: "+",
              index: 12,
              line: 1
            });
            $J.expect(cmd[10]).toEqual({
              token: "2",
              index: 14,
              line: 1
            });
            $J.expect(cmd[11]).toEqual({
              token: ";",
              index: 15,
              line: 1
            });
            $J.expect(cmd[12]).toEqual({
              token: "\n",
              index: 16,
              line: 1
            });
          });
        });
      });
    });

    $J.describe("Events:", function () {
      var emitter = null;
      $J.beforeEach(function () {
        emitter = sinon.spy(parser, "emit");
      });

      $J.describe("command", function () {

        $J.it("should emit after submitting a command", function () {
          var cmd = "x = 3";
          var ans = parser.evaluate(cmd);
          $J.expect(emitter.getCall(0).args[0]).toEqual("command");
        });

        $J.it("should NOT emit after submitting a comment", function () {
          var cmd = "% # Test Heading";
          var ans = parser.evaluate(cmd);
          $J.expect(emitter.getCall(0).args[0]).not.toEqual("command");
        });

        $J.it("should emit correctly in a script", function (done) {
          var cmd = "x = 3\n y = 4\n";
          var ans = parser.evaluate(cmd, function () {
            $J.expect(emitter.getCall(0).args[0]).toEqual("command");
            $J.expect(emitter.getCall(2).args[0]).toEqual("command");
            done();
          });

        });
      });

      $J.describe("result", function () {
        it("should emit after emitting the `command`", function (done) {
          var cmd = "x = 3";
          var ans = parser.evaluate(cmd, function () {
            $J.expect(emitter.getCall(0).args[0]).toEqual("command");
            $J.expect(emitter.getCall(1).args[0]).toEqual("result");
            $J.expect(emitter.getCall(1).args[1]).toEqual({
              name: "x",
              ans: [
                [ 3 ]
              ]
            });
            $J.expect(emitter.getCall(1).args[2]).toEqual(true);
            done();
          });

        });

        $J.it("should emit correctly in a script", function (done) {
          var cmd = "x = 3\n y = 4\n";
          var ans = parser.evaluate(cmd, function () {
            $J.expect(emitter.getCall(1).args[0]).toEqual("result");
            $J.expect(emitter.getCall(3).args[0]).toEqual("result");
            done();
          });

        });
      });

      $J.describe("comment", function () {
        $J.it("should emit after submitting a comment", function (done) {
          var cmd = "% # Test Heading";
          var ans = parser.evaluate(cmd, function () {
            $J.expect(emitter.getCall(0).args[0]).toEqual("comment");
            $J.expect(emitter.getCall(0).args[1]).toEqual("# Test Heading\n");
            //expect(emitter.getCall(0).args[2]).toEqual(true);
            done();
          });

        });

        $J.it("should NOT emit after submitting a commentless command", function (done) {
          var cmd = "x = 3";
          var ans = parser.evaluate(cmd, function () {
            $J.expect(emitter.getCall(0).args[0]).not.toEqual("comment");
            done();
          });

        });

        $J.it("should emit correctly in a script", function (done) {
          var cmd = "% setting x\n x = 3\n y = 4\n% done setting values";
          var ans = parser.evaluate(cmd, function () {
            $J.expect(emitter.getCall(0).args[0]).toEqual("comment");
            $J.expect(emitter.getCall(5).args[0]).toEqual("comment");
            done();
          });

        });
      });
    });

  });

});