define([
  "./sum",
  './std',
  './mean',
  './size',
  "numeric"], function (sum, std, mean, size) {

  function ztest() {

    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    if (args.length < 3) {
      throw new Error("Operator Error :: ZTEST : Improperly configured - ZTEST requires the arguments X (data), m (mean) and sigma (stdDev).");
    }
    var A = args.shift();
    var m = args.shift()[0][0];
    var sigma = args.shift()[0][0];
    var dim = null;
    var sides = 2;
    var greaterThan = null;
    var alpha = 0.05;
    var df, i = 0;

    var params = {};
    if (args.length % 2 === 0) {
      while (i < args.length) {
        params[args[i].toLowerCase()] = args[i + 1];
        i += 2;
      }
    } else {
      throw new Error("Operator Error :: CHI2GOF : Each argument key must have a corresponding value.");
    }

    if ('alpha' in params) {
      alpha = params.alpha;
    }

    var sz = size(A);
    // dim can be 1 or 2 or not defined.
    // Value of 1 tests column means
    // Value of 2 tests row means
    // Default is to test first non-singular dimension
    //
    // If the input A is a vector (either dimensional size is 1), then
    // detault to the dimention that has length
    if ('dim' in params && [1, 2].indexOf(params.dim)) {
      dim = params.dim;
    } else if (sz[0][0] === 1) {
      dim = 2; // only one row, test the row
    } else if (sz[0][1] === 1) {
      dim = 1; // only one col, test the col
    } else {
      // TODO determine which dimension is non-singular, default to row test
      dim = 2;
    }

    // 'both'  Test the alternative hypothesis that the population mean is not equal to m.
    // 'right' Test the alternative hypothesis that the population mean is greater than m.
    // 'left'  Test the alternative hypothesis that the population mean is less than m.
    // 'both' is default
    if ('tail' in params) {
      if (params.tail === 'right') {
        sides = 1;
        sideTest = 1;
        greaterThan = true;
      } else if (params.tail === 'left') {
        sides = 1;
        sideTest = -1;
        greaterThan = false;
      }
    }

    // take mean, std, and n of rows or columns
    var Am = mean(A, dim);
    var As = std(A, 0, dim);
    var An = numeric.div(sum(A, dim), Am);

    var h = [
      []
    ], p = [
      []
    ], ci = [], zval = [
      []
    ];
    for (i = 0; i < Am.length; i++) {
      var _zval = jStat.zscore(Am[0][i], m, sigma);
      var _p = jStat.ztest(Am[0][i], m, sigma, sides);
      var _h = (_p < alpha) && (sides === 1) ? ((_zval * sideTest) > 0) : true;
      var _ci = jStat.normalci(m, alpha, As[0][i], An[0][i]);

      h[0].push(_h ? 0 : 1);
      p[0].push(_p);
      ci.push(_ci);
      zval[0].push(_zval);
    }
    callback(null, h, p, ci, zval);
  }

  ztest.async = true;

  ztest.shortHelp = "Computes the z-test of the input data.";
  ztest.help = "# [h,p,ci,zval] = ztest(x,m,sigma)\n\
This function returns a test decision for the null hypothesis that the \
data in the vector x comes from a normal distribution with mean m and a standard deviation sigma, \
using the z-test. The alternative hypothesis is that the mean is not m. The result h is 1 if the test \
rejects the null hypothesis at the 5% significance level, and 0 otherwise.";

  return ztest;
});