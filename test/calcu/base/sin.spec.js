define([
  "cali-calcu/base/rand",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/sin"
], function (rand, $J, CommandParser, Matchers, sin) {

  describe("cali.module.base.sin", function () {

    // setup the environment
    var parser = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the trigonometric sine of the input", function () {
      var inputs = [
        [
          [0]
        ],
        [
          [0.5]
        ],
        [
          [3.142]
        ],
        [
          [5]
        ],
        [
          [0, 0.5, 3.142, 5]
        ],
        [
          [0],
          [0.5],
          [3.142],
          [5]
        ],
        [
          [0, 0.5],
          [3.142, 5]
        ],
      ];
      var outputs = [
        [
          [0]
        ],
        [
          [0.4794]
        ],
        [
          [-0.000407]
        ],
        [
          [-0.9589]
        ],
        [
          [0, 0.4794, -0.000407, -0.9589]
        ],
        [
          [0],
          [0.4794],
          [ -0.000407],
          [-0.9589]
        ],
        [
          [0, 0.4794],
          [-0.000407, -0.9589]
        ],
      ];

      for (var i in inputs) {
        expect(sin(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});