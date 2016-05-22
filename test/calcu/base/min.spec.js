define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/min"
], function ($J, CommandParser, Matchers, min) {


  $J.describe("cali.module.base.min", function () {

    // setup the environment
    var parser = null;
    var eye = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the min product of the input", function () {
      var inputs = [
        [
          [
            [0],
            [2],
            [1],
            [4]
          ],
          ,
        ],
        [
          [
            [0, 2, 1, 4]
          ],
          ,
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
          ,
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
          ,
          1
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
          ,
          2
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
          [
            [2]
          ] ,
        ],
        [
          [
            [0, 1, 1],
            [2, 3, 2],
            [1, 3, 2],
            [4, 2, 2]
          ],
          [
            [3, -1, 1],
            [5, -1, 100],
            [1, 99, 0],
            [4.001, 0, 0]
          ],
        ],
      ];
      var outputs = [
        [
          [0]
        ],
        [
          [0]
        ],
        [
          [0, 1, 1]
        ],
        [
          [0, 1, 1]
        ],
        [
          [0],
          [2],
          [1],
          [2]
        ],
        [
          [0, 1, 1],
          [2, 2, 2],
          [1, 2, 2],
          [2, 2, 2]
        ],
        [
          [0, -1, 1],
          [2, -1, 2],
          [1, 3, 0],
          [4, 0, 0]
        ]
      ];

      for (var i in inputs) {
        expect(min(inputs[i][0], inputs[i][1], inputs[i][2])).toBeMatrixCloseTo(outputs[i], eps);
      }
    });

  });

});