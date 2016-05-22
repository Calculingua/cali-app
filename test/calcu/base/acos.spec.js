define([
  "$J",
  "cali-calcu/base/acos",
  "../dev/Matchers"
], function ($J, acos, Matchers) {

  $J.describe("cali.module.base.acos", function () {

    var eps = 1e-4;
    $J.beforeEach(function () {
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    $J.it("should computes the trigonometric acose of the input", function () {
      var inputs = [
        [[0]],
        [[0.5]],
        [[1]],
        [[-1]],
        [[0, 0.5, 1, -1]],
        [[0],[0.5],[1],[-1]],
        [[0, 0.5],[1, -1]]
      ];
      var outputs = [
        [[1.57080]],
        [[1.0471976]],
        [[0]],
        [[3.14160]],
        [[1.57080, 1.0471976, 0, 3.14160]],
        [[1.57080],[1.0471976],[0],[3.14160]],
        [[1.57080, 1.0471976],[0, 3.14160]]
      ];

      for (var i in inputs) {
        $J.expect(acos(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});