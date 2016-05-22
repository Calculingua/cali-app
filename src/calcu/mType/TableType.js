define([], function () {


  function indexColumns(variable) {
      var i;
    if (variable.properties.VariableNames.length === 0) {
      for (i = 0; i < variable.data.length; i++) {
        variable.properties.VariableNames.push("Var" + (i + 1));
      }
    }

    for (i = 0; i < variable.properties.VariableNames.length; i++) {
      if (typeof variable.nameIndex[variable.properties.VariableNames[i]] === "undefined" || variable.nameIndex[variable.properties.VariableNames[i]] == i) {
        variable.nameIndex[variable.properties.VariableNames[i]] = i;
      } else {
        throw "Operation Error : TABLE : The variable names must be distinct.";
      }
    }
  }

  function indexRows(variable) {
      var i;
    if (variable.properties.RowNames.length > 0) {
      for (i = 0; i < variable.properties.RowNames.length; i++) {
        if (typeof variable.rowIndex[variable.properties.RowNames[i]] === "undefined" || variable.rowIndex[variable.properties.RowNames[i]] == i) {
          variable.rowIndex[variable.properties.RowNames[i]] = i;
        } else {
          throw "Operation Error : TABLE : The row names must be distinct.";
        }
      }
    }
  }

  function Table(obj) {
    this.type = "TABLE";
    this.data = [];
    this.nameIndex = {};
    this.rowIndex = {};
    this.properties = {
      VariableNames: [],
      RowNames: [],
      DimensionNames: [],
      Description: "",
      VariableDescriptions: [],
      VariableUnits: [],
      UserData: null
    };

    var key;
    if (obj) {
      this.data = obj.data || [];
      for (key in obj.properties) {
        this.properties[key] = obj.properties[key];
      }
      indexColumns(this);
      indexRows(this);
    }
  }

  Table.indexColumns = indexColumns;
  Table.indexRows = indexRows;

  Table.indexColumns = indexColumns;
  Table.indexRows = indexRows;

  return Table;

});