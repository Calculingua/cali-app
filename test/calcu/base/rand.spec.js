define([
  "async",
  "cali-calcu/base/size",
  "../dev/Matchers",
  "$J",
  "cali-calcu/CommandParser",
  "cali-calcu/base/rand"
], function (async, size, Matchers, $J, CommandParser, rand) {


  $J.describe("cali.module.base.rand", function () {

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
            [10]
          ],
          [
            [10]
          ]
        ],
        [
          [
            [10]
          ],
          [
            [8]
          ]
        ],
        [
          [
            [10, 77]
          ],
        ],

      ];
      var sizeR = [
        [4, 4],
        [10, 10],
        [10, 8],
        [10, 77]
      ];

      for (var i in inputs) {
        var ans = rand.rand(inputs[i][0], inputs[i][1]);
        expect(ans.length).toEqual(sizeR[i][0]);
        expect(ans[0].length).toEqual(sizeR[i][1]);
      }
    });

    it('should return a number and not throw an error', function (done) {
      var i;
      var inputs = [
        'x = normrnd(10,2);',
        'x = binornd(10, 0.1);',
        'x = poissrnd(2);',
        'x = gamrnd(5, 10);',
        'x = betarnd(1,2);',
      ]

      function tryErr(input) {
        return function (cb) {
          parser.evaluate(input, function (err, ans) {
            expect(err).toBeFalsy();
            cb();
          });
        };
      }

      async.each(inputs, function (input, cb) {
        expect(function () {
          parser.evaluate(input, function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans).toBeTruthy();
            expect(typeof ans[0].ans[0][0]).toEqual('number');
            cb();
          });
        }).not.toThrow();
      }, function (err) {
        done();
      });

    });

    it("should return a matrix of randoms from scalar params", function (done) {
      var inputs = [
        'x = normrnd(10,2, 2, 3);',
        'x = binornd(10, 0.1, 2, 3);',
        'x = poissrnd(2, 2, 3);',
        'x = gamrnd(5, 10, 2, 3);',
        'x = betarnd(1,2, 2, 3);',
        'x = normrnd(10,2, [2, 3]);',
        'x = binornd(10, 0.1, [2, 3]);',
        'x = poissrnd(2, [2, 3]);',
        'x = gamrnd(5, 10, [2, 3]);',
        'x = betarnd(1,2, [2, 3]);',
      ];
      console.log("MATRIX!!!");
      async.each(inputs, function (input, cb) {
        expect(function () {
          parser.evaluate(input, function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans).toBeTruthy();
            expect(size(ans[0].ans)).toBeMatrixCloseTo([
              [2, 3]
            ], 1e-4);
            cb();
          });
        }).not.toThrow();
      }, function (err) {
        done();
      });

    });


    it("should return a matrix of randoms from matrix params", function (done) {

      var inputs = [
        'x = normrnd([10, 10; 10,10],[2, 2; 2,2]);',
        'x = binornd([10,10;10,10], [0.1,0.1;0.1,0.1]);',
        'x = poissrnd([2,2;2,2]);',
        'x = gamrnd([5,5;5,5], [10,10;10,10]);',
        'x = betarnd([1,1;1,1],[2,2;2,2]);',
      ];

      async.each(inputs, function (input, cb) {
        expect(function () {
          parser.evaluate(input, function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans).toBeTruthy();
            expect(size(ans[0].ans)).toBeMatrixCloseTo([
              [2, 2]
            ], 1e-4);
            cb();
          });
        }).not.toThrow();
      }, function (err) {
        done();
      });

    });

  });

});