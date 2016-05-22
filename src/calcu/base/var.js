define(['./mean'],function (mean) {

  function func(A, flag, dim) {

    var dimA = 1;
    var i;

    var out = [
      []
    ];
    var itts, ittsA;

    if (dim == 2) {
      dimA = 2;
      ittsA = A.length;
    } else if (dim == 1) {
      dimA = 1;
      ittsA = A[0].length;
    } else {
      ittsA = A[0].length;
      if (A.length <= 1) {
        dimA = 2;
        ittsA = A.length;
      }
    }

    if (dimA == 2) {
      out = [];
    }

    var vectA;

    var k = 0;
    var kA;
    itts = ittsA;

    var means = mean(A, dim);
    var mu;
    for (k; k < itts; k++) {
      kA = k;

      if (ittsA == 1) {
        kA = 0;
      }
      vectA = [];
      if (dimA == 2) {
        for (i = 0; i < A[kA].length; i++) {
          vectA.push(A[kA][i]);
        }
        mu = means[kA][0];
      } else {
        for (i = 0; i < A.length; i++) {
          vectA.push(A[i][kA]);
        }
        mu = means[0][kA];
      }

      var cc = [];
      cc[0] = 0;
      for (i = 0; i < vectA.length; i++) {
        cc[0] += Math.pow(vectA[i] - mu, 2);
      }
      if (flag) {
        cc[0] = cc[0] / vectA.length;
      } else {
        cc[0] = cc[0] / (vectA.length - 1);
      }

      if (dimA == 1) {
        out[0].push(cc[0]);
      } else {
        out.push(cc);
      }
    }
    return out;
  }

  func.shortHelp = "Computes the variance of the input.";
  func.help = "# var(A, flag, dim) \n \
var(A), computes the variance along the columns of A.\n\
var(A, w) computes the variance of the columns of A. When w == 0 it \n\
uses the same as var(A) which is the (1/n-1)formula (1/n) formula. \n\
When w == 1 it uses the (1/n) formula.\n\
var(A, w, dim) returns the variance along the specified dimension.\n";

  return func;
});