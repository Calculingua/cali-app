define([
], function () {

  function atan(A) {

    var out = [];
    var row;
    for (var i in A) {
      row = [];
      for (var j in A[i]) {
        row.push(Math.atan(A[i][j]));
      }
      out.push(row);
    }
    return out;
  }

  atan.shortHelp = "Computes the trigonometric arc tangent of a matrix.";
  atan.help = "# atan(A) \n \
Computes the trigonometric arc tangent of the matrix 'A'. \n";



  return atan;

});