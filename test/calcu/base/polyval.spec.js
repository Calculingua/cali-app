define([
  "$J",
  "cali-calcu/CommandParser"
], function ($J, CommandParser) {

  $J.describe("cali.module.base.polyval(coefficients, x)", function () {

    var parser = new CommandParser();

    describe("integration with command parser", function () {
      [
        {command: "polyval([3,2,1],[5,7,9])", expected: [
          [86, 162, 262]
        ]},
        {command: "polyval([10,0,12],[1,0])", expected: [
          [22, 12]
        ]},
        {command: "polyval([0.1234, 0.1298],[2,0])", expected: [
          [0.3766, 0.1298]
        ]}
      ].forEach(function (test, index) {
          it("should evaluate function correctly" + index, function () {
            parser.evaluate(test.command, function (err, ans) {
              expect(ans[0].ans).toEqual(test.expected);
            });
          });
        });
    });

  });

});