define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/median"
], function ($J, CommandParser, Matchers, median) {


  $J.describe("cali.module.base.median", function () {

    // setup the environment
    var parser = null;
    var eye = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the median of the input", function () {
      var inputs = [
        [
          [
            [0],
            [2],
            [1],
            [4],
            [6]
          ],
        ],
        [
          [
            [0, 2, 1, 4, 6]
          ],
        ],
        [
          [
            [0],
            [2],
            [4],
            [1]
          ],
        ],
        [
          [
            [0, 2, 4, 1]
          ],
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
          1
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
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
          [1.5]
        ],
        [
          [1.5]
        ],
        [
          [1.5, 2.5, 2]
        ],
        [
          [1.5, 2.5, 2]
        ],
        [
          [1],
          [2],
          [2],
          [2]
        ],
      ];

      for (var i in inputs) {
        expect(median(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});