define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/mldivide"
], function ($J, CommandParser, Matchers, mldivide) {


  $J.describe("cali.module.base.mldivide", function () {

    // setup the environment
    var parser = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should solve the linear system AX=B", function () {
      var inputs = [
        [
          [
            [8, 1, 6],
            [3, 5, 7],
            [4, 9, 2]
          ],
          [
            [1],
            [2],
            [3]
          ]
        ]
      ];
      var outputs = [
        [
          [0.0500],
          [0.3000],
          [0.0500]
        ]
      ];

      for (var i in inputs) {
        expect(mldivide(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});