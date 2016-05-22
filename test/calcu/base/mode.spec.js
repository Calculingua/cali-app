define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/mode"
], function ($J, CommandParser, Matchers, mode) {

  $J.describe("cali.module.base.mode", function () {

    // setup the environment
    var parser = null;
    var eye = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the mode of the input", function () {
      var inputs = [
        [
          [
            [0],
            [2],
            [1],
            [2],
            [6]
          ],
        ],
        [
          [
            [0, 2, 1, 2, 6]
          ],
        ],
        [
          [
            [0, 3],
            [2, -1],
            [77, 77],
            [2, 77],
            [6, 3]
          ],
        ],
        [
          [
            [0, 3],
            [2, -1],
            [77, 77],
            [2, 77],
            [6, 3]
          ],
          1
        ],
        [
          [
            [0, 3],
            [2, -1],
            [77, 77],
            [2, 77],
            [6, 3]
          ],
          2
        ],
      ];
      var outputs = [
        [
          [2]
        ],
        [
          [2]
        ],
        [
          [2, 3]
        ],
        [
          [2, 3]
        ],
        [
          [0],
          [-1],
          [77],
          [2],
          [3]
        ]
      ];

      for (var i in inputs) {
        expect(mode(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});