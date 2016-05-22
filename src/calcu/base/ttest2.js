define(["../mType/HashTable",
  "../lib/distributions",
  './transpose',
  './size'], function (HashTable, distributions, transpose, size) {


  // h = ttest2(x,y)
  // h = ttest2(x,y,Name,Value)
  // [h,p] = ttest2(___)
  // [h,p,ci,stats] = ttest2(___)

  function ttest2() {
    var i, j, sum;
    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    var X, Y;
    if (args.length >= 2) {
      X = args.shift();
      Y = args.shift();
    } else {
      return callback(new Error('ttest2 require two independent sample sets'));
    }

    var alpha = 0.05;
    var dim = 1;            // MATLAB CONVENSION - 1=column, 2=row
    var tail = 'both';
    var vartype = true;
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
      return callback(new Error("Operator Error :: TTEST2 : Each argument key must have a corresponding value."));
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
      return callback(new Error("Dimension Error :: TTEST2 : No non-singular dimension in matrices passed"));
      // TODO determine which dimension is non-singular, default to col test
    }

    // internally, we will iterate over data in rows
    if (dim === 1) {
      X = transpose(X);
      Y = transpose(Y);
      szX = size(X);
      szY = size(Y);
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

    // VARIANCE TYPE PARAMETER
    // 'equal'     Conduct test using the assumption that x and y are from normal distributions
    //             with unknown but equal variances.
    // 'unequal'   Conduct test using the assumption that x and y are from normal distributions
    //             with unknown and unequal variances. This is called the Behrens-Fisher problem.
    //             ttest2 uses Satterthwaite's approximation for the effective degrees of freedom.
    if ('vartype' in params && ['equal', 'unequal'].indexOf(params.vartype)) {
      vartype = (params.vartype === 'equal');
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
    var stats = {
      tstat: [
        []
      ],
      df: [
        [dof]
      ],
      sd: null,
    };

    if (vartype) {
      stats.sd = [
        []
      ];
    } else {
      stats.sd = [];
    }

    var mX, mY, varX, varY, diff, thalf, serr, sPooled;
    var studentt = distributions.studentt;
    for (var set = 0; set < sets; set++) {
      mX = jStat.mean(X[set]);
      varX = jStat.variance(X[set], true); // `true` flag means take sample variance, not population

      mY = jStat.mean(Y[set]);
      varY = jStat.variance(Y[set], true);

      diff = mX - mY;

      if (vartype) {  // equal variances, so pool the variance
        sPooled = Math.sqrt((( (lengthX - 1) * varX) + ((lengthY - 1) * varY)) / dof);
        serr = sPooled * Math.sqrt((1 / lengthX) + (1 / lengthY));
        stats.sd[0].push(sPooled);
      } else {
        serr = Math.sqrt((varX / lengthX) + (varY / lengthY));
        stats.sd.push([Math.sqrt(varX), Math.sqrt(varY)]);
      }


      stats.tstat[0].push((diff - 0) / serr);
      p[0].push(studentt.cdf(stats.tstat[0][set], dof) * sides);
      h[0].push((Math.abs(p[0][set]) < alpha) ? 1 : 0);

      tHalf = studentt.inv((1 - alpha / 2), dof);
      ci.push([diff - (tHalf * serr), diff + (tHalf * serr)]);

    }


    var res = new HashTable(stats);
    callback(null, h, p, ci, res);


  }

  ttest2.async = true;

  return ttest2;


});