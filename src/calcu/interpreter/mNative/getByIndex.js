define(["../../mType/CellArrayType",
  "../../mType/TableType"], function (CellArrayType, TableType) {


  function cloneArrays(A) {
    var out;
    if (A instanceof Array) {
      out = [];
      for (var i = 0; i < A.length; i++) {
        out.push(cloneArrays(A[i]));
      }
    } else if (A instanceof Object) {
      throw "Object not supported";
    } else {
      out = A;
    }
    return out;
  }


  function getByIndex() {

    var i,j;
    var out;
    try {
      var args = Array.prototype.slice.call(arguments, 0);
      var A = args.shift();
      i = args.shift();
      if (A.type && A.type == "TABLE") {
        var cols = cloneArrays(A.properties.VariableNames);
        var rows = cloneArrays(A.properties.RowNames);
        var rowI = A.rowIndex;
        var colI = A.nameIndex;
        A = cloneArrays(A.data);
        j = args.shift();
        var obj = {data: [], properties: {RowNames: [], VariableNames: []}};
        var dd, rowInd, colInd, k, nn, ii,iOld,jOld;
        // for rows defined by name
        try {
          if (i.type && i.type == "CELL_ARRAY") {
            iOld = i;
            i = [
              []
            ];
            for (k = 0; k < iOld[0].length; k++) {
              nn = iOld[0][k][0].join("");
              if (typeof rowI[nn] == "undefined") {
                throw "butts";
              }
              i[0].push(rowI[nn] + 1);
            }
          }

          // for cols defined by name
          if (j.type && j.type == "CELL_ARRAY") {
            jOld = j;
            j = [
              []
            ];
            for (k = 0; k < jOld[0].length; k++) {
              nn = jOld[0][k][0].join("");
              if (typeof colI[nn] == "undefined") {
                throw "butts";
              }
              j[0].push(colI[nn] + 1);
            }
          }
        } catch (ex) {
          throw "Unknown index.";
        }

        try {

          for (var jj = 0; jj < j[0].length; jj++) {
            dd = [];
            colInd = j[0][jj] - 1;

            for (ii = 0; ii < i[0].length; ii++) {
              rowInd = i[0][ii] - 1;
              dd.push(A[ colInd ][ rowInd ]);
            }
            obj.data.push(dd);
            obj.properties.VariableNames.push(cols[colInd]);
          }
        } catch (ex) {
          throw "Index exceeds dimensions.";
        }
        for (ii = 0; ii < i[0].length; ii++) {
          rowInd = i[0][ii] - 1;
          if (rows.length > 0) {
            obj.properties.RowNames.push(rows[rowInd]);
          }
        }
        out = new TableType(obj);

      } else {
        A = cloneArrays(A);
        out = [];
        try {
          if (args.length > 0) {
            args.unshift(null);
            for (j = 0; j < i[0].length; j++) {
              args[0] = A[i[0][j] - 1];
              out.push(getByIndex.apply(this, args));
            }
          } else {
            for (j = 0; j < i[0].length; j++) {
              if (typeof A[i[0][j] - 1] == "undefined") {
                throw "butts";
              }
              out.push(A[i[0][j] - 1]);
            }
          }
        } catch (ex) {
          throw "Index exceeds dimensions.";
        }
        if (arguments[0].type && arguments[0].type == "CELL_ARRAY") {
          out = new CellArrayType(out);
        }
      }
    } catch (ex) {
      throw "Operator Error :: getByIndex :: " + ex.toString();
    }

    return out;
  }

  getByIndex.shortHelp = "Returns the specified indices.";
  getByIndex.help = "# getByIndex(A, i, j, ...) \n\
Returns the specified indices.\n\n";

  return getByIndex;

});
