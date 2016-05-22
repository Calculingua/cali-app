define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function ($J, CommandParser, Matchers) {


  $J.describe("cali.module.base.polyfit", function () {
    var parser = new CommandParser();
    var eps = 1e-4;
    beforeEach(function (done) {
      jasmine.Expectation.addMatchers(Matchers);
      parser.evaluate([
        'x = [0, 0.3, 0.8, 1.1, 1.6, 2.3];',
        'y = [0.6, 0.67, 1.01, 1.35, 1.47, 1.25];',
      ].join('\n'), function (err, ans) {
        done();
      });
    });

    describe("fitting polynomials", function () {
      it("should fit a 5th order polynomial", function (done) {

        var cmd = '[p, S, mu] = polyfit(x, y, 2);';
        var exp = {
          p: [
            [-0.2942, 1.0231, 0.4981]
          ],
          S: [
            [1, 2, 3]
          ],
          mu: [
            [6.1, 12.5948]
          ]
        }


        parser.evaluate(cmd, function (err, ans) {
          if (err) {
            console.log(err);
          }
          expect(err).toBeFalsy();
          expect(ans[0].ans).toBeMatrixCloseTo(exp.p, eps);
          // expect(ans[1].ans).toBeMatrixCloseTo(exp.S);
          expect(ans[2].ans).toBeMatrixCloseTo(exp.mu, eps);
          done();
        });
      });
    });

  });

});