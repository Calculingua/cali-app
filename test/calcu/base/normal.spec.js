define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions"
], function ($J, CommandParser, Matchers, baseFunctions) {

  $J.describe('cali.module.base.normal.*', function () {
    var parser, eps;

    // ==== CDF ================================================================
    $J.describe('normcdf', function () {

      $J.beforeEach(function () {
        $J.jasmine.Expectation.addMatchers(Matchers);
        parser = new CommandParser();
        eps = 1e-3;
      });

      $J.it('returns the cdf of a single number', function () {
        parser.evaluate('p = normcdf(2.5,3,0.5);', function (err, ans) {
          console.log('args', arguments);
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.158, eps);
        });
      });

      $J.it('returns the cdf of a single number using default mean and stdv', function () {
        parser.evaluate('p = normcdf(0.25);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.59871, eps);
        });
      });

      $J.it('returns an array of cdfs', function () {
        parser.evaluate('p = normcdf([-1,0, 1]);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans).toBeMatrixCloseTo([
            [0.15866, 0.5, 0.84134]
          ], eps);
        });
      });
    });

    // ==== PDF ================================================================
    $J.describe('normpdf', function () {
      var normpdf = baseFunctions.normpdf;

      $J.beforeEach(function () {
        $J.jasmine.Expectation.addMatchers(Matchers);
        parser = new CommandParser();
        eps = 1e-3;
      });

      $J.it('returns the pdf of a single number', function () {
        parser.evaluate('p = normpdf(2.5,3,0.5);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.484, eps);
        });
      });

      $J.it('returns the pdf of a single number using default mean and stdv', function () {
        parser.evaluate('p = normpdf(0.25);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.387, eps);
        });
      });

      $J.it('returns an array of pdfs', function () {
        parser.evaluate('p = normpdf([-1,0, 1]);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans).toBeMatrixCloseTo([
            [0.242, 0.399, 0.242]
          ], eps);
        });
      });

    });

    // ==== INV ================================================================
    $J.describe('norminv', function () {

      $J.beforeEach(function () {
        $J.jasmine.Expectation.addMatchers(Matchers);
        parser = new CommandParser();
        eps = 1e-3;
      });

      $J.it('returns the inverse cdf of a single number', function () {
        parser.evaluate('p = norminv(0.158,3,0.5);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans[0][0]).toBeCloseTo(2.5, eps);
        });
      });

      $J.it('returns the inverse cdf of a single number using default mean and stdv', function () {
        parser.evaluate('p = norminv(0.59871);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.25, eps);
        });
      });

      $J.it('returns an array of inverse cdfs', function () {
        parser.evaluate('p = norminv([0.15866, 0.5, 0.84134]);', function (err, ans) {
          $J.expect(err).toBeFalsy();
          $J.expect(ans[0].ans).toBeMatrixCloseTo([
            [-1, 0, 1]
          ], eps);
        });
      });

    });

  });

});