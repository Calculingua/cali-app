define([], function () {

  function transpose(A) {
    var out = [];
    for (var i = 0; i < A[0].length; i++) {
      out.push([]);
      for (var j = 0; j < A.length; j++) {
        out[i].push(A[j][i]);
      }
    }
    return out;
  }

  transpose.shortHelp = "Returns the transpose of the input matrix.";
  transpose.help = "# transpose(A) \n \
transpose(A), computes the non-conjugative transpose the matrix A.\n";

  return transpose;

});
