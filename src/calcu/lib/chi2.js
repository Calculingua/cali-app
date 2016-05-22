define([
    "./NdArray", 
    "./NumericNdArray", 
    "./distributions"], function (NdArray, NumericNdArray, distributions) {


  function chi2Stat(obs, exp) {
    if (obs instanceof Array) {
      obs = new NdArray(obs);
    }

    if (exp instanceof Array) {
      exp = new NdArray(exp);
    }

    // Make sure they are the same dimension
    if (!obs.sameShape(exp)) {
      throw new Error("chi2Stat: Observed and Expected data must be the same shape");
    }

    console.log("obs exp", obs.toArray(), exp.toArray());
    var r, c, x2;
    if (obs.shape.length === 1) {
      x2 = 0;
      for (c = 0; c < obs.length; c++) {
        console.log("GET OBS EXP", c, obs.get(c), exp.get(c));
        x2 += Math.pow(obs.get(c) - exp.get(c), 2) / exp.get(c);
      }
    } else if (obs.shape.length === 2) {
      x2 = [];
      for (r = 0; r < obs.shape[0]; r++) {
        x2.push(chi2Stat(obs.slice(0, r), exp.slice(0, r)));
      }
    } else {
      throw new Error("chi2Stat: Does not support dimensions greater than 2");
    }

    return x2;
  }


  function chi2Ind(table) {
    if (table instanceof Array) {
      table = new NumericNdArray(table);
    }

    if (table.shape.length !== 2) {
      throw new Error("chi2Ind: Only accepts 2d tables");
    }

    var rowSums = [];
    var colSums = [];
    var total = 0;
    var sum;

    // Sum up each row and column
    table.forEach(0, function (row) {
      sum = row.sum();
      total += sum;
      rowSums.push(sum);
    });
    table.forEach(1, function (col) {
      colSums.push(col.sum());
    });

    // calculate the expected values form the row and column sums
    var expTable = new NumericNdArray(
      new Array(table.length),
      table.shape
    );

    expTable.forEach(function (_, idx) {
      expTable.set(idx, (rowSums[idx[0]] * colSums[idx[1]]) / total);
    });

    // Calculate the x2 statistic for the table
    var exp, x2 = 0;
    table.forEach(function (obs, idx) {
      exp = expTable.get(idx);
      x2 += Math.pow(obs - exp, 2) / exp;
    });

    return x2;
  }


  function chi2p(x2, df) {
    df = df || 1;
    return 1 - distributions.chisquare.cdf(x2, df);
  }


  return {
    chi2Stat: chi2Stat,
    chi2Ind: chi2Ind,
    chi2p: chi2p
  };


});