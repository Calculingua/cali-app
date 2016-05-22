define([
  "$J",
  "../dev/Matchers",
  "cali-calcu/lib/polyfit"
], function ($J, Matchers, polyfit) {

  $J.describe("Polyfit", function () {

    $J.it("should fit an n=2 polynomial", function () {
      $J.jasmine.Expectation.addMatchers(Matchers);
      var out;
      var inputs = [
        {
          x: [0, 0.3, 0.8, 1.1, 1.6, 2.3],
          y: [0.6, 0.67, 1.01, 1.35, 1.47, 1.25],
          n: 2
        }

      ];
      var outputs = [
        [-0.2942, 1.0231, 0.4981]
      ];

      inputs.forEach(function (input, i) {
        out = polyfit(input.x, input.y, input.n).toArray();
        $J.expect(out).toBeMatrixCloseTo([outputs[i]], 1e-4);
      })
    });
  });

});
