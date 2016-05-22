define([], function () {

  function ones(n, m) {

    if (typeof m == "undefined") m = n;
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push([]);
      for (var j = 0; j < m; j++) {
        out[i][j] = 1;
      }
    }
    return out;
    // callback(null, out);
  }

  //ones.async = true;

  ones.shortHelp = "Creates a matrix of all ones.";
  ones.help = "# ones(n, m) \n \
Creates a matrix of dimensions n x m of all ones.  If only 'n' \
is input, the output matrix is of dimensions n x n \n";

  return ones;

});