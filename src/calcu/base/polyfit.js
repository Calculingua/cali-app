define([
  '../mType/HashTable',
  '../lib/polyfit'], function (HashTable, polyfitLib) {


  function polyfit(x, y, n, callback) {
    n = n[0][0];
    var P, coef, S, meanx, stdx, Shash;
    S = {
      // R   Triangular factor from a QR decomposition of the Vandermonde matrix of x
      // df  Degrees of freedom
      // normr   Norm of the residuals
    };


    P = polyfitLib(x[0], y[0], n);
    coef = P.toArray();
    S = [
      [456]
    ];
    meanx = x[0].reduce(function (p, c) {
      return p + c;
    }, 0) / x.length;
    stdx = Math.sqrt(x[0].reduce(function (p, c) {
      return p + Math.pow(c - meanx, 2);
    }, 0) / x.length);

    Shash = new HashTable(S);
    return callback(null, coef, Shash, [
      [meanx, stdx]
    ]);
  }

  polyfit.async = true;
  polyfit.shortHelp = "Polynomial curve fitting";
  polyfit.help = "# polyfit(x, y, n) \n \
Returns the coefficients for a polynomial p(x) of degree n that is a best fit (in a least-squares sense) for the data in y.\n";

  return polyfit;

});