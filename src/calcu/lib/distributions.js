define(["jStat"], function (jStat) {

  function borrowFromJStat(accumulator, value) {
    accumulator[value] = jStat[value];
    return accumulator;
  }

  var distributions = ["beta", "centralF", "cauchy", "chisquare", "exponential", "gamma", "invgamma", "kumaraswamy", "lognormal",
    "normal", "pareto", "studentt", "weibull", "uniform", "binomial", "negbin", "hypgeom", "poisson",
    "triangular"].reduce(borrowFromJStat, {});

  function binoinv(u, n, p) {
    var bino = distributions.binomial;
    // newtons method - inefficient
    var q = n * p;
    var q0 = q;//unused!

    var cdf = 2;
    for (q = n; q >= 0; q--) {
      cdf = bino.cdf(q, n, p);
      // console.log(q, cdf);
      if (cdf <= u) return q + 1;
    }
    throw Error("Inverse Binomial CDF did not converge");
  }

  function poissoninv(p, l) {
    return jStat.gammapinv(p, l) | 0;
  }


  distributions.binomial.inv = binoinv;
  distributions.poisson.inv = poissoninv;

  return distributions;

});