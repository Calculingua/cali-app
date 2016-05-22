define(["../../mType/TableType"], function (TableType) {
    
    function formatVariableName(input){
        var out = input.join("");
        out = out.replace(/^\s+|\s+$/g, "");
        out = out.replace(/\s/g, "_");
        return out;
    }

  function table() {

    var i, j, done, nRows;
    var obj = {
      data: [],
      properties: {
        VariableNames: [],
        RowNames: []
      }
    };
    i = 0;
    while (i < arguments.length) {
      if (typeof arguments[i][0][0] === "string") {
        switch (arguments[i][0].join("")) {
          case "VariableNames":
            i++;
            if (arguments[i][0].length !== obj.data.length) {
              throw "Operation Error : TABLE : The number of variable names must match the number of variables.";
            }

            for (j = 0; j < arguments[i][0].length; j++) {
              obj.properties.VariableNames.push(formatVariableName(arguments[i][0][j][0]));
            }
            i++;
            break;
          case "RowNames":
            i++;
            if (arguments[i][0].length !== obj.data[0].length) {
              throw "Operation Error : TABLE : The number of row names must match the number of variables.";
            }

            for (j = 0; j < arguments[i][0].length; j++) {
              obj.properties.RowNames.push(arguments[i][0][j][0].join(""));
            }
            i++;
            break;
          default:
            throw "Operation Error : TABLE : Unknown property.";
        }
      } else {
        if (!nRows) {
          nRows = arguments[i].length;
        }
        if (nRows !== arguments[i].length) {
          throw "Operation Error : TABLE : Variables must have the same number of rows.";
        }
        obj.data.push(arguments[i]);
        i++;
      }
    }
    var tab;
    try {
      tab = new TableType(obj);
    } catch (ex) {
      throw ex;
    }

    return tab;
  }

  table.shortHelp = "Creates a table variable from the input items.";
  table.help = "# table() \n\
table(var1,...,varN) creates a table variable from the input items.  Each variable input becomes a column, \
and can be accessed through dot notation.  The column names are 'Var1', 'Var2', ..., 'Var{n}'. \n\n\
table(var1,...,varN, 'Name', Value) creates a table from the variables and allows setting the specified properties.  \
Below is a list of possible properties: \n\n\
- 'RowNames' : {'name1', 'name2', ...} -- defines the names of the rows.  By default, this is empty. \n\n\
- 'VariableNames' : {'name1', 'name1', ...} -- defines the names of the columns.  \n\n";

  return table;

});
