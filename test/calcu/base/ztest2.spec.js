define([
  "async",
  "sinon",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (async, sinon, $J, CommandParser, Matchers) {

  $J.describe("cali.module.base.ztest2", function () {
    // setup the environment
    var parser = null;
    var eps = null

    beforeEach(function (done) {
      eps = 1e-3;
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);

      var lines = [
        'X1 = [10, 13, 9, 7, 11];',         // mean: 10, var: 4
        'Y1 = [11, 15, 8, 11, 15];',          // mean: 12, var: 13.2
      ].join('\n');

      // D0=0: z = -2/sqrt(4/5 + 13.2/5) = -1.0783 -> p = 0.2809
      // D0=2: z = -4/sqrt(4/5 + 13.2/5) = -2.156 -> p = 0.031084
      parser.evaluate(lines, function (err, ans) {
        done(err);
      });
    });

    it("Should perform two samples z-test", function () {
      var inputs = [
        "[h,p,ci,zval] = ztest2(X1, Y1, 0 , 4, 13.2);",
        "[h,p,ci,zval] = ztest2(X1, Y1, 2 , 4, 13.2);",
      ];

      var outputs = [
        [
          [
            [0]
          ],
          [
            [0.2809]
          ],
          [
            [-5.6351, 1.6351]
          ],
          [
            [-1.0783]
          ]
        ],
        [
          [
            [1]
          ],
          [
            [0.031084]
          ],
          [
            [-5.6351, 1.6351]
          ],
          [
            [-2.1566]
          ]
        ],
      ];


      // parser.evaluate(inputs[0], function(err, ans) {
      //     console.log("err", err);
      //     console.log("ans", ans);
      //     console.log("I am not showing up in the console.");
      // });

      var i = 0;
      async.each(inputs, function (item, cb) {
        parser.evaluate(item, function (err, ans) {
          expect(err).toBeFalsy();
          expect(ans[0].ans).toBeMatrixCloseTo(outputs[i][0], eps);
          expect(ans[1].ans).toBeMatrixCloseTo(outputs[i][1], eps);
          expect(ans[2].ans).toBeMatrixCloseTo(outputs[i][2], eps);
          expect(ans[3].ans).toBeMatrixCloseTo(outputs[i][3], eps);
          i++;
          cb();
        });
      }, function (err, anss) {
      });
    });

  });
});

