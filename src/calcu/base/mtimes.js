define([], function () {

  function mtimes(A, B) {
    var out = [];
    var isAMatrix = true, isBMatrix = true;
    if (A.length > 1 || A[0].length > 1) {
      if (B.length == 1 && B[0].length == 1) {
        isBMatrix = false;
      }
    } else {
      isAMatrix = false;
    }
    var i, j, k;
    if (isAMatrix && isBMatrix) {
        // check if they are the correct size to multiply.  
        if(A[0].length !== B.length){
            throw "Operation Error : MULTIPLICATION : matrices cannot be multiplied because they have the wrong dimensions.";
        }
      for (i = 0; i < A.length; i++) {
        out.push([]);
        for (j = 0; j < B[0].length; j++) {
          out[i].push(0);
          for (k = 0; k < A[i].length; k++) {
            out[i][j] += A[i][k] * B[k][j];
          }
        }
      }
    } else if (isBMatrix) {
      for (i = 0; i < B.length; i++) {
        out.push([]);
        for (j = 0; j < B[i].length; j++) {
          out[i].push(A[0][0] * B[i][j]);
        }
      }
    } else {
      for (i = 0; i < A.length; i++) {
        out.push([]);
        for (j = 0; j < A[i].length; j++) {
          out[i].push(A[i][j] * B[0][0]);
        }
      }
    }

    return out;
  }

  mtimes.shortHelp = "Multiplies the two matrices.";
  mtimes.help = "# mtimes(A, B) \n \
mtimes(A, B), multiplies the two matrices.\n";

  return mtimes;

});
