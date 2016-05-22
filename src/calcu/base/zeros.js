define([], function () {

  function zeros(n, m) {

    if (m == null) {
      m = n;
    }
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push([]);
      for (var j = 0; j < m; j++) {
        out[i][j] = 0;
      }
    }
    return out;
  }

  zeros.shortHelp = "Creates a matrix of all zeros.";
  zeros.help = "# zeros(n, m) \n \
Creates a matrix of dimensions n x m of all zeros.  If only 'n' \
is input, the output matrix is of dimensions n x n \n";

  return zeros;
});