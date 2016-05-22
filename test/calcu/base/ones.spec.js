define([
  "$J",
  "cali-calcu/base/ones",
  "../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, ones, Matchers, CommandParser) {


  $J.describe("cali.module.base.ones(n, m)", function () {

    // setup the environment
    var parser = null;
    $J.beforeEach(function () {
      parser = new CommandParser();
    });

    $J.describe("creates a matrix of ones", function () {

      $J.it("should return a 2x2", function () {
        var out = ones(2, 2);
        $J.expect(out).toEqual([
          [1, 1],
          [1, 1]
        ]);
      });

      $J.it("should return a 1x1", function () {
        var out = ones(1, 1);
        $J.expect(out).toEqual([
          [1]
        ]);
      });

      $J.it("should return a 3x2", function () {
        var out = ones(3, 2);
        $J.expect(out).toEqual([
          [1, 1],
          [1, 1],
          [1, 1]
        ]);
      });

      $J.it("should return a 2x3", function () {
        var out = ones(2, 3);
        $J.expect(out).toEqual([
          [1, 1, 1],
          [1, 1, 1]
        ]);
      });

      $J.it("should return a square when only a sigle variable is specified", function () {
        var out = ones(2);
        $J.expect(out).toEqual([
          [1, 1],
          [1, 1]
        ]);
      });
    });

    $J.describe("integrates with the command parser", function () {

      $J.it("should return with numbers as variables", function () {
        var input = "ones(2, 2)";
        var correct = [
          [1, 1],
          [1, 1]
        ];
        parser.evaluate(input, function (err, ans) {

          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          $J.expect(ans[0].ans).toEqual(correct);

        });
      });

      $J.it("should return with variables as variables", function () {
        parser.evaluate("x = 2");
        parser.evaluate("y = 2");

        var input = "ones(x, y)";
        var correct = [
          [1, 1],
          [1, 1]
        ];
        parser.evaluate(input, function (err, ans) {

          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          $J.expect(ans[0].ans).toEqual(correct);
        });
      });
    });
  });

});
