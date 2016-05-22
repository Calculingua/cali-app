define([
  "./examgrades1.mat",
  "async",
  "sinon",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (examgrades1, async, sinon, $J, CommandParser, Matchers) {

  describe("cali.module.base.ztest", function () {
    // setup the environment
    var parser = null;
    var eps = null
    beforeEach(function (done) {
      eps = 1;
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);

      parser.evaluate(examgrades1, function (err, ans) {
        done(err);
      });
    });

    it("Should perform z-test", function () {
      var inputs = [
        "[h,p,ci,zval] = ztest(examgrades1 ,75,10);",
      ];

      var outputs = [
        [
          [
            [0]
          ],
          [
            [0.9927]
          ],
          [
            [73.2191, 76.7975]
          ],
          [
            [0.0091]
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
          console.log(ans[1].ans[0][0], outputs[i][1][0][0]);
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

