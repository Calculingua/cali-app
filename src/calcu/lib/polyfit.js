define([
  "./Matrix",
  "numeric"
], function (Matrix, numeric) {

  // x and y are equal-length arrays of numbers
  // n is a number
  function polyfit(x, y, n) {
    if (!n) {
      n = 1;
    }
    var i;

    if (x.length !== y.length) {
      throw new Error("polyfit: x and y must be the same length");
    }

    // For the time being, make y a column-major matrix
    // Later, we should have a Vector type and defined matrix-
    // vector multiplication
    var Y = new Matrix([y], [y.length, 1]);
    var X = new Matrix(new Array((n + 1) * x.length), [x.length, n + 1]);


    // create a Vandermonde matrix from x
    x.forEach(function (val, idx) {
      for (i = n; i >= 0; i--) {
        X.set([idx, n - i], Math.pow(val, i));
      }
    });

    var Xt = X.transpose();
    var XtX = Xt.times(X);
    var XtXinv = new Matrix(numeric.inv(XtX.toArray()));
    var Coef = XtXinv.times(Xt).times(Y);

    return Coef.transpose();
  }

  return polyfit;

});