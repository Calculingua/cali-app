define([
  "$J",
  "cali-calcu/lib/random"
], function ($J, random) {

  $J.describe("cali.module.lib.random", function () {
    var params = {
      beta: {alpha: 2, beta: 2},
      centralF: {df1: 2, df2: 2},
      cauchy: {local: 2, scale: 2},
      chisquare: {dof: 2},
      exponential: {rate: 2},
      gamma: {shape: 2, scale: 2},
      invgamma: {shape: 2, scale: 2},
      lognormal: {mu: 2, sigma: 2},
      normal: {mean: 2, std: 2},
      studentt: {dof: 2},
      weibull: {scale: 2, shape: 2},
      uniform: {a: 2, b: 2},
      binomial: {n: 2, p: 2},
      poisson: {l: 2},
      triangular: {a: 2, b: 2, c: 2}
    };

    $J.it("Should call random on each distribution without throwing an error", function () {
      var out;
      for (var dist in params) {
        function foo() {
          out = random(dist, params[dist]);
        }
        $J.expect(foo).not.toThrow();
      }
    });
  });

});