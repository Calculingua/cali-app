define([], function () {


  function compareMatrix(actual, expected, eps) {
    var act = null;
    var exp = null;
    var out = true;
    // make sure they have the same number of entires
    if (actual.length == expected.length) {
      // step through each row
      for (var i = 0; i < actual.length; i++) {
        // make sure that they have the same number of colums
        if (actual[i].length == expected[i].length) {
          // step through each column
          for (var j = 0; j < actual[i].length; j++) {
            // construct the rounded actual value
            act = Math.round(actual[i][j] / eps);
            // construct the rounded expected value
            exp = Math.round(expected[i][j] / eps);
            // if they are equal, continue
            if (act == exp) {
              out = true;
            }
            // if they aren't equal, return false;
            else {
              out = false;
              return out;
            }
          }
        } else {
          out = false;
          return out;
        }
      }
    } else {
      out = false;
      return out;
    }
    return out;
  }

  function inTolerance(actual, expected, pct) {
    return Math.abs((actual-expected)/expected) <= pct;
  }

  function arrayInTolerance(actual, expected, pct) {
    if ("number" === typeof actual && "number" === typeof expected) {
        return inTolerance(actual, expected, pct);
    } else if (actual instanceof Array && expected instanceof Array) {
        return actual.every(function(val, idx) {
            return arrayInTolerance(actual[idx], expected[idx], pct);
        });
    } else {
        return false;
    }
  }

  return {
    toBeInTolerance: function() {
        return {
            compare: function(actual, expected, pct) {
                return {pass: inTolerance(actual, expected, pct)};
            }
        };
    },

    toBeMatrixInTolerance: function(actual, expected, pct) {
        return {
            compare: function(actual, expected, pct) {
                return {pass: arrayInTolerance(actual, expected, pct)};
            }
        };
    },

    toBeMatrixCloseTo: function () {
      return {
        compare: function (actual, expected, eps) {

          return {
            pass: compareMatrix(actual, expected, eps)
          };
        }
      };
    }
  };

});