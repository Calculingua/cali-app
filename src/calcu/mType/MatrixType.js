define([], function () {

  function MatrixType(input) {
    this.type = "MATRIX";
    function cloneArray(arr) {
      var out;
      if (typeof arr != 'string' && typeof arr.length !== "undefined") {
        out = [];
        for (var i = 0; i < arr.length; i++) {
          out.push(cloneArray(arr[i]));
        }
      } else {
        out = arr;
      }
      return out;
    }

    if (typeof input !== "undefined" && typeof input.length !== "undefined") {
      for (var i = 0; i < input.length; i++) {
        this.push(cloneArray(input[i]));
      }
    }
  }
  MatrixType.prototype = [];

  return MatrixType;

});