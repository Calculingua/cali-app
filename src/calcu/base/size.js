define([], function () {

  function size(x) {

    if ('undefined' === typeof x.length) {
      return [
        [0, 0]
      ];
    }

    var nRows = 0;
    var nCols = x[0].length;
    if (nCols > 0) {
      nRows = x.length;
    }
    return [
      [ nRows, nCols ]
    ];
  }

  size.shortHelp = "Returns the dimensional size of the input.";
  size.help = "# size(x) \n \
Returns the dimensional size of the matrix 'x'.\n";

  return size;

});