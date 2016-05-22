define([], function () {

  function acos(A) {

    var out = [];
    var row;
    for (var i in A) {
      row = [];
      for (var j in A[i]) {
        row.push(Math.acos(A[i][j]));
      }
      out.push(row);
    }
    return out;
  }

  acos.shortHelp = "Computes the trigonometric arc-cosine of a matrix.";
  acos.help = "# acos(A) \n \
Computes the trigonometric arc cosine of the matrix 'A'. \n";


  return acos;

});
