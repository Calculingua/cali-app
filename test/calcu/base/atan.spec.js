define([
  "$J",
  "cali-calcu/base/atan",
  "../dev/Matchers"
], function ($J, atan, Matchers) {


  describe("cali.module.base.atan", function () {

    // setup the environment
    var eps;
    $J.beforeEach(function () {
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    $J.it("should computes the trigonometric atane of the input", function () {
      var inputs = [
        [
          [0]
        ],
        [
          [0.5]
        ],
        [
          [1]
        ],
        [
          [-1]
        ],
        [
          [0, 0.5, 1, -1]
        ],
        [
          [0],
          [0.5],
          [1],
          [-1]
        ],
        [
          [0, 0.5],
          [1, -1]
        ]
      ];
      var outputs = [
        [
          [0]
        ],
        [
          [0.463648]
        ],
        [
          [0.785398]
        ],
        [
          [-0.785398]
        ],
        [
          [0, 0.463648, 0.785398, -0.785398]
        ],
        [
          [0],
          [0.463648],
          [ 0.785398],
          [-0.785398]
        ],
        [
          [0, 0.463648],
          [0.785398, -0.785398]
        ]
      ];

      for (var i in inputs) {
        $J.expect(atan(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});