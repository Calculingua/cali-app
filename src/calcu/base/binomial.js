define([
  '../lib/NdArray',
  '../lib/distributions'
], function (NdArray, distributions) {

  function fill(mat, n) {
    mat.forEach(function (_, idx) {
      mat.set(idx, n);
    });
    return mat;
  }


  function binopdf(X, N, P) {
    var Xm = new NdArray(X);
    var Nm = new NdArray(N);
    var Pm = new NdArray(P);

    // Scalar inputs for N and P should be expanded to the size of X
    if (Xm.length > 1 && Nm.length === 1) {
      Nm = fill(new NdArray(new Array(Xm.length), Xm.shape), N[0][0]);
    }
    if (Xm.length > 1 && Pm.length === 1) {
      Pm = fill(new NdArray(new Array(Xm.length), Xm.shape), P[0][0]);
    }

    if (!Xm.sameShape(Nm) || !Xm.sameShape(Pm)) {
      throw new Error("binopdf: X, N and P must have the same dimensions.");
    }

    var out = new NdArray(new Array(Xm.length), Xm.shape);
    var n, p;

    Xm.forEach(function (k, idx) {
      n = Nm.get(idx);
      p = Pm.get(idx);
      out.set(idx, distributions.binomial.pdf(k, n, p));
    });

    return out.toArray();
  }

  function binocdf(X, N, P) {
    var Xm = new NdArray(X);
    var Nm = new NdArray(N);
    var Pm = new NdArray(P);

    // Scalar inputs for N and P should be expanded to the size of X
    if (Xm.length > 1 && Nm.length === 1) {
      Nm = fill(new NdArray(new Array(Xm.length), Xm.shape), N[0][0]);
    }
    if (Xm.length > 1 && Pm.length === 1) {
      Pm = fill(new NdArray(new Array(Xm.length), Xm.shape), P[0][0]);
    }

    if (!Xm.sameShape(Nm) || !Xm.sameShape(Pm)) {
      throw new Error("binocdf: X, N and P must have the same dimensions.");
    }

    var out = new NdArray(new Array(Xm.length), Xm.shape);
    var n, p;

    Xm.forEach(function (k, idx) {
      n = Nm.get(idx);
      p = Pm.get(idx);
      out.set(idx, distributions.binomial.cdf(k, n, p));
    });

    return out.toArray();

  }

  function binoinv(U, N, P) {
    var Um = new NdArray(U);
    var Nm = new NdArray(N);
    var Pm = new NdArray(P);

    // Scalar inputs for N and P should be expanded to the size of U
    if (Um.length > 1 && Nm.length === 1) {
      Nm = fill(new NdArray(new Array(Um.length), Um.shape), N[0][0]);
    }
    if (Um.length > 1 && Pm.length === 1) {
      Pm = fill(new NdArray(new Array(Um.length), Um.shape), P[0][0]);
    }

    if (!Um.sameShape(Nm) || !Um.sameShape(Pm)) {
      throw new Error("binoinv: U, N and P must have the same dimensions.");
    }

    var out = new NdArray(new Array(Um.length), Um.shape);
    var n, p;

    Um.forEach(function (u, idx) {
      n = Nm.get(idx);
      p = Pm.get(idx);
      out.set(idx, distributions.binomial.inv(u, n, p));
    });

    return out.toArray();
  }

  function binostat() {

  }


  binopdf.shortHelp = 'Computes the binomial pdf at each of the values in X using the corresponding number of trials in N and probability of success for each trial in P';
  binocdf.shortHelp = 'Computes a binomial cdf at each of the values in x using the corresponding number of trials in N and probability of success for each trial in p. x, N';
  binoinv.shortHelp = 'Computes the inverse cdf for a binomial distribution. ';

  binoinv.help = "# Inverse CDF - Binomial Distribution \n \
Computes the inverse cumulative distribution function for a binomial distribution. \n\n\
## Syntax\n\
```\n\
X = binoinv(Y, N, P);\n\
```\n\n\
## Description \n\
Computes the inverse CDF for a binomial distribution.  Given the probability `Y` \
and the distribution specification `N` and `P`, it computes `X` such that it equals or exceeds `Y`.\n\n\
### Inputs\n\
- `Y` -- The probability that we are finding an inverse for. \n\
- `N` -- The number of trials. It must be a positive integer. \n\
- `P` -- Probability of success.  It must be on the interval `[0 1]`. \n\n\
### Outputs\n\
- `X` -- The number of successful trials. \n\n\
## Examples\n\
1. Finding the number of expected wins for a .500 team. \n\
```\n\
h = binoinv([0.05, 0.95], 162, 0.5)\n\
% h = [71, 91] \n\
```\n\n\
## References\n\n\
1. Binomial Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Binomial_distribution](http://en.wikipedia.org/wiki/Binomial_distribution)\n";

  binocdf.help = "# CDF - Binomial Distribution \n \
Computes a binomial cumulative distribution function for the specified distribution. \n\n\
## Syntax\n\
```\n\
y = binocdf(x, N, p)\n\
```\n\n\
## Description \n\
Computes a binomial CDF at each of the values in `x` using the corresponding number of trials in `N` and probability of success for each trial in `p`.\n\n\
### Inputs\n\
- `x` -- The number of successes for which to find the CDF. \n\
- `N` -- The number of trials. It must be a positive integer. \n\
- `p` -- Probability of success.  It must be on the interval `[0 1]`. \n\n\
### Outputs\n\
- `y` -- The cumulative distribution function of `x` given the specified binomial distribution. \n\n\
## Examples\n\
1. Find the likelihood of a .500 team winning 100 games in a 162 game season.\n\
```\n\
y = 1 - binocdf(100, 162, 0.5)\n\
% y = 0.001 \n\
```\n\n\
## References\n\n\
1. Binomial Distribution;Wikipedia; [http://en.wikipedia.org/wiki/Binomial_distribution](http://en.wikipedia.org/wiki/Binomial_distribution)\n";

  binopdf.help = "# PDF - Binomial Distribution \n \
Computes the binomial probability distribution function. \n\n\
## Syntax\n\
```\n\
y = binopdf(x, N, p)\n\
```\n\n\
## Description \n\
Computes the binomial probability distribution function at each of the values in `x` using the corresponding number of trials in `N` and probability of success for each trial in `P`.\n\n\
### Inputs\n\
- `x` -- The number of successes for which to find the PDF. \n\
- `N` -- The number of trials. It must be a positive integer. \n\
- `p` -- Probability of success.  It must be on the interval `[0 1]`. \n\n\
### Outputs\n\
- `y` -- The probability of observing up to `x` successes in `N` trials. \n\n\
## Examples\n\
1. For a product with 2% defects and production rate of 200 per day, what's the likelihood of a QA inspector finding 0 defects in a day?\n\
```\n\
y = binocdf(0, 200, 0.02)\n\
% y = 0.018 \n\
```\n\n\
## References\n\n\
1. Binomial Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Binomial_distribution](http://en.wikipedia.org/wiki/Binomial_distribution)\n";

  return {
    binopdf: binopdf,
    binocdf: binocdf,
    binoinv: binoinv
  };

});
