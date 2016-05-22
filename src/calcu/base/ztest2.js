define(["./transpose",
  "./size",
  "../lib/distributions"],function (transpose, size, distributions) {
  // h = ztest2(x,y, D0, varX, varY)
  // h = ztest2(x,y, D0, varX, varY ,Name,Value)
  // [h,p] = ztest2(___)
  // [h,p,ci,stats] = ztest2(___)
  // D0 is the difference between the population means
  function ztest2() {
    var i, j, sum;
    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    var X, Y, D0, varX, varY;
    if (args.length >= 5) {
      X = args.shift();
      Y = args.shift();
      D0 = args.shift();
      varX = args.shift();
      varY = args.shift();
    } else {
      return callback(new Error('ztest2 requires sample data, difference in population mean and population variance for two independent sets'));
    }

    var alpha = 0.05;
    var dim = 1;            // MATLAB CONVENSION - 1=column, 2=row
    var tail = 'both';
    var sides = 2;
    var sideTest = null;
    var greaterThan = null;
    var params = {};

    if (args.length % 2 === 0) {
      while (i < args.length) {
        params[args[i].toLowerCase()] = args[i + 1];
        i += 2;
      }
    } else {
      return callback(new Error("Operator Error :: ZTEST2 : Each argument key must have a corresponding value."));
    }

    // ALPHA PARAMETER
    if ('alpha' in params) {
      alpha = params.alpha;
    }

    // DIM PARAMETER
    var szX = size(X);
    var szY = size(Y);
    // If the input A is a vector (either dimensional size is 1), then
    // detault to the dimention that has length
    if ('dim' in params && [1, 2].indexOf(params.dim)) {
      dim = params.dim;
    } else if (szX[0][1] > 1) {
      dim = 2; // only one row, test the row
    } else if (szX[0][0] > 1) {
      dim = 1; // only one col, test the col
    } else {
      return callback(new Error("Dimension Error :: ZTEST2 : No non-singular dimension in matrices passed"));
      // TODO determine which dimension is non-singular, default to col test
    }

    // internally, we will iterate over data in rows
    if (dim === 1) {
      X = transpose(X);
      Y = transpose(Y);
    }

    // TAIL PARAMETER
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
      } else {
        greaterThan = true;
      }
    }


    // DIMENSION CHECK
    // if the data is in the columns, make sure we have the same number of rows
    if (dim === 1 && szX[0][0] !== szY[0][0]) {
      return callback(new Error("Dimension Error: mismatch between X and Y"));
    }
    // if the data is in the rows, maker usre we have the same number of columns
    if (dim === 2 && szX[0][1] !== szY[0][1]) {
      return callback(new Error("Dimension Error: mismatch between X and Y"));
    }

    var sets, lengthX, lengthY;
    sets = szX[0][0];
    lengthX = size(X)[0][1];
    lengthY = size(Y)[0][1];
    var dof = lengthX + lengthY - 2;

    var h = [
      []
    ];
    var p = [
      []
    ];
    var ci = [];
    var zstat = [
      []
    ];

    var mX, mY;
    var norm = distributions.normal;
    for (var set = 0; set < sets; set++) {
      mX = jStat.mean(X[set]);
      mY = jStat.mean(Y[set]);
      // console.log("X", X[set], mX)
      // console.log("Y", Y[set], mY)

      var diff = mX - mY;
      var serr = Math.sqrt(varX / lengthX + varY / lengthY);
      var zHalf = norm.inv((1 - alpha / 2), 0, 1);
      var z = ( diff - D0[0][set] ) / serr;

      p[0].push(norm.cdf(z, 0, 1) * sides);
      h[0].push((Math.abs(p[0][set]) < alpha) ? 1 : 0);
      ci.push([diff - (zHalf * serr), diff + (zHalf * serr)]);
      zstat[0].push(z);

    }

    callback(null, h, p, ci, zstat);

  }

  ztest2.async = true;

  return ztest2;


});