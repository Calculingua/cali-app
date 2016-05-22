define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/prod"
], function ($J, CommandParser, Matchers, prod) {


  describe("cali.module.base.prod", function () {

    // setup the environment
    var parser = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the prod of the array input", function () {
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
          [.03]
        ],
        [
          [0.03]
        ],
        [
          [.125, .008, .027, 1]
        ],
        [
          [.125, .008, .027, 1]
        ],
        [
          [.03],
          [.03],
          [.03]
        ]
      ];

      for (var i in inputs) {
        if (typeof inputs[i][1] === "undefined") {
          expect(prod(inputs[i][0])).toBeMatrixCloseTo(outputs[i], eps);
        }
        else {
          expect(prod(inputs[i][0], inputs[i][1])).toBeMatrixCloseTo(outputs[i], eps);
        }
      }
    });

  });

});