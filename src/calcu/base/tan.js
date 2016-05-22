define([],function () {

  function tan(A) {

    var out = [];
    var row;
    for (var i in A) {
      row = [];
      for (var j in A[i]) {
        row.push(Math.tan(A[i][j]));
      }
      out.push(row);
    }
    return out;
  }

  tan.shortHelp = "Computes the trigonometric tangent of the input.";
  tan.help = "# tan(A) \n \
Computes the trigonometric tangent of the matrix 'A'. Values are input in radians.\n";

  return tan;
});