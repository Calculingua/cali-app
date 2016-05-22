define([], function () {

  function getColumn(variable, colName) {

    var prop;
    try {
      colName = colName[0].join("");
      if (typeof variable.nameIndex[colName] !== "undefined") {
        prop = variable.data[variable.nameIndex[colName]];
      } else {
        throw "Column not found.";
      }
    } catch (ex) {
      throw "Operator Error :: getColumn :: " + ex.toString();
    }

    return prop;
  }

  getColumn.shortHelp = "Returns the specified column from the table.";
  getColumn.help = "# getColumn(A, colName) \n\
Returns the specified column from the table. \n\n";

  return getColumn;

});
