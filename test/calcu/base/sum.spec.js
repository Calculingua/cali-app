define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/sum"
], function ($J, CommandParser, Matchers, sum) {

  describe("cali.module.base.sum", function () {

    // setup the environment
    var parser = null;
    var eye = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the sum of the array input", function () {
      var inputs = [
        [
          [
            []
          ],
        ],
        [
          [
            [0.5, .2, .3, 1]
          ],
        ],
        [
          [
            [0.5],
            [.2],
            [.3],
            [1]
          ],
        ],
        [
          [
            [0.5, .2, .3, 1],
            [0.5, .2, .3, 1],
            [0.5, .2, .3, 1]
          ],
        ],
        [
          [
            [0.5, .2, .3, 1],
            [0.5, .2, .3, 1],
            [0.5, .2, .3, 1]
          ],
          1
        ],
        [
          [
            [0.5, .2, .3, 1],
            [0.5, .2, .3, 1],
            [0.5, .2, .3, 1]
          ],
          2
        ],
      ];
      var outputs = [
        [
          [0]
        ],
        [
          [2]
        ],
        [
          [2]
        ],
        [
          [1.5, .6, .9, 3]
        ],
        [
          [1.5, .6, .9, 3]
        ],
        [
          [2],
          [2],
          [2]
        ]
      ];

      for (var i in inputs) {
        if (typeof inputs[i][1] === "undefined") {
          expect(sum(inputs[i][0])).toBeMatrixCloseTo(outputs[i], eps);
        }
        else {
          expect(sum(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
        }
      }
    });

  });

});