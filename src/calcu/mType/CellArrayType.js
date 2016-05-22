define([], function () {

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


  function CellArrayType(input) {
    this.type = "CELL_ARRAY";
    if (typeof input !== "undefined" && typeof input.length !== "undefined") {
      for (var i = 0; i < input.length; i++) {
        this.push(cloneArray(input[i]));
      }
    } else {
      this.push([]);
    }
  }

  CellArrayType.prototype = [];

  return CellArrayType;

});