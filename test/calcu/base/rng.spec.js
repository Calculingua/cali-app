define([
  "cali-calcu/base/rand",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/rng"
], function (rand, $J, CommandParser, Matchers, rng) {

  $J.describe("cali.module.base.rng", function () {

    // setup the environment
    var parser = null;
    var eps;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });

    it("should computes the addition of the array input", function () {
      var inputs = [
        [
          [
            [4]
          ]
        ],
        [
          [
            [4]
          ]
        ],
        [
          [
            [10]
          ]
        ],
        [
          [
            [4]
          ]
        ],

      ];
      var out = [];

      for (var i in inputs) {
        var ans = rng(inputs[i][0]);
        expect(ans).toBeFalsy();
        out.push(rand.rand([
          [2, 1]
        ]));
      }
      out.push(rand.rand([
        [2, 1]
      ]));
      expect(out[0]).toEqual(out[1]);
      expect(out[0]).not.toEqual(out[2]);
      expect(out[0]).toEqual(out[3]);
      expect(out[0]).not.toEqual(out[4]);

    });

  });
});