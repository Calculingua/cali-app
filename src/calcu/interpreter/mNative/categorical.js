define(["../../mType/Categorical"], function (Categorical) {

  function isEqual(val0, val1) {
    if (!val0.length && !val1.length) {
      return val0 == val1;
    }
    if (val0.length !== val1.length) {
      return false;
    }

    if (val0[0].length !== val1[0].length) {
      return false;
    }

    for (var i = 0; i < val0.length; i++) {
      if (!isEqual(val0[i], val1[i])) {
        return false;
      }
    }
    return true;
  }

  function categorical() {

    var i, j, k, row, value, key;
    var A, vv, nn, opts = {"Ordinal": [
      [0]
    ]};
    i = 0;
    while (i < arguments.length) {
      if (i === 0) {
        A = arguments[i];
      } else if (i == 1) {
        if (typeof arguments[i][0][0] == "string") {
          opts[arguments[i][0].join("")] = arguments[i + 1];
          i++;
        } else {
          vv = arguments[i];
        }
      } else if (i == 2) {
        if (typeof arguments[i][0][0] == "string") {
          opts[arguments[i][0].join("")] = arguments[i + 1];
          i++;
        } else {
          nn = arguments[i];
        }
      } else {
        if (typeof arguments[i][0][0] == "string") {
          opts[arguments[i][0].join("")] = arguments[i + 1];
          i++;
        } else {
          throw "Unknown argument";
        }
      }
      i++;
    }

    var obj = {data: [], properties: {values: [], names: [], raw: A, Ordinal: opts.Ordinal}};
    if (vv) {
      if (vv.type && vv.type == "CELL_ARRAY") {

        for (j = 0; j < vv[0].length; j++) {
          if (typeof vv[0][j][0][0] === "string") {
            obj.properties.values.push(vv[0][j][0].join(""));
          } else {
            obj.properties.values.push(vv[0][j][0][0]);
          }
        }

      } else {
        for (j = 0; j < vv[0].length; j++) {
          obj.properties.values.push(vv[0][j]);
        }
      }
    }

    if (!A) {
      throw "Operator Error :: categorical :: Input missing.";
    }

    if (nn) {
      if (nn.type && nn.type == "CELL_ARRAY") {
        for (j = 0; j < nn[0].length; j++) {
          obj.properties.names.push(nn[0][j][0].join(""));
        }
      } else {
        for (j = 0; j < nn[0].length; j++) {
          obj.properties.names.push(nn[0][j]);
        }
      }

    } else if (vv) {
      for (j = 0; j < obj.properties.values.length; j++) {
        obj.properties.names.push(obj.properties.values[j]);
      }
    }

    for (i = 0; i < A.length; i++) {
      row = [];
      for (j = 0; j < A[0].length; j++) {
        if (A.type && A.type == "CELL_ARRAY") {
          if (typeof A[i][j][0][0] === "string") {
            value = A[i][j][0].join("");
          } else {
            value = A[i][j][0][0];
          }

        } else {
          value = A[i][j];
        }

        k = obj.properties.values.indexOf(value);
        if (k == -1) {
          obj.properties.values.push(value);
          obj.properties.names.push(value);
          key = obj.properties.values.length - 1;
        } else {
          key = k;
        }
        row.push(key);
      }
      obj.data.push(row);
    }

    var tab = new Categorical(obj);

    return tab;
  }

  categorical.shortHelp = "Creates a categorical variable from a matrix or cell array";
  categorical.help = "# categorical(...) \n \
categorical(A) creates a categorical variable from the matrix or cell array A.  \n\n\
categorical(A, value) creates a categorical variable from A with category values specified.  \n\n\
categorical(A, value, name), creates a categorical variable from A with categories and category names specified. \n\n\
categorical(A, ___, 'Key', value) creates a categorical variable with the following possible additional inputs:  \n\n\
- 'Ordinal' : 0 or 1 -- denotes that the categories have an order (or not).  \n\n";


  return categorical;

});

