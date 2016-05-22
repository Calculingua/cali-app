define([], function () {

  function createResults(nbins) {
    var result = {
      counts: new Array(nbins),
      centers: new Array(nbins),
      starts: new Array(nbins),
      binWidth: 0
    };

    var i;
    for (i = 0; i < nbins; i += 1) {
      result.counts[i] = 0;
    }

    return result;
  }


  function minMax(vector) {
    var out = {min: Infinity, max: -Infinity};
    for (var i = 0; i < vector.length; i += 1) {
      out.min = Math.min(out.min, vector[i]);
      out.max = Math.max(out.max, vector[i]);
    }
    return out;
  }


  /**
   * @param vector
   * @param nbins
   * @returns {{counts: Array, centers: Array, starts: Array, binWidth: number}}
   */
  function hist(vector, nbins) {


    var result = createResults(nbins);

    var mima = minMax(vector);
    result.binwidth = (mima.max - mima.min) / nbins;

    var i;
    for (i = 0; i < nbins; i += 1) {
      result.starts[i] = mima.min + (result.binwidth * i);
      result.centers[i] = result.starts[i] + (result.binwidth / 2);
    }

    var lastIndex = result.counts.length - 1;
    var index;
    for (i = 0; i < vector.length; i += 1) {
      index = (vector[i] - mima.min) / result.binwidth;
      index = Math.floor(index);
      index = Math.min(index, lastIndex);
      result.counts[index] += 1;
    }

    return  result;

  }

  function isBinsEvenlySpaced(xbins) {
    var diff = xbins[1] - xbins[0];
    var tmp, i;
    for (i = 1; i < xbins.length; i += 1) {
      tmp = xbins[i] - xbins[i - 1];
      if (tmp !== diff) {
        return false;
      }
    }
    return true;
  }



  /**
   *
   * @param X
   * @param xbins vector of evenly spaced values (this is equivalent to the hist(X,Y) implementation
   */
  function histInBins(X, xbins) {

    if (xbins.length === 1) {
      return [X.length];
    }

    if (!isBinsEvenlySpaced(xbins)){
      throw new Error("xbins should be evenly spaced values.");
    }

    var result = createResults(xbins.length);
    result.binWidth = xbins[1] - xbins[0];

    var i;
    for (i = 0; i < xbins.length; i += 1) {
      result.centers[i] = xbins[i];
      result.starts[i] = xbins[i] - result.binWidth / 2;
    }

    var mi = xbins[0] - result.binWidth / 2;
    var lastIndex = result.counts.length - 1;
    var index;
    for (i = 0; i < X.length; i += 1) {

      index = (X[i] - mi) / result.binWidth;
      index = Math.floor(index);
      index = Math.min(index, lastIndex);
      index = Math.max(index, 0);

      result.counts[index] += 1;
      result.starts[index] = Math.min(result.starts[index], X[i]);

    }

    return  result;
  }

  return {
    hist: hist,
    histInBins: histInBins
  };

});