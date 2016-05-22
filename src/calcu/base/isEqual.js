define([], function () {


  function isEqual(x, y) {

    var equal = true;
    if (x.length == y.length) {
      for (var i = 0; i < x.length; i++) {
        if (x[i].length == y[i].length) {
          for (var j = 0; j < x[i].length; j++) {
            if (x[i][j] != y[i][j]) {
              equal = false;
              break;
            }
          }
        } else {
          equal = false;
        }
        if (!equal) {
          break;
        }
      }
    } else {
      equal = false;
    }
    return equal;
  }

  isEqual.shortHelp = "Checks for equality between the inputs.";
  isEqual.help = "# isEqual(x, y) \n \
Checks for equality between the inputs.\n";

  return isEqual;
});