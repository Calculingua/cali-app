define(["../../mType/CellArrayType"], function (CellArrayType) {


  function getProperty(variable, propName) {

    var prop;
    try {
      // prop = variable.mGetProperty(propName);
      propName = propName[0].join("");
      prop = [
        []
      ];
      switch (propName) {
        case "VariableNames":
        case "RowNames":
        case "VariableDescriptions":
        case "VariableUnits":
          prop = new CellArrayType();
          for (var i = 0; i < variable.properties[propName].length; i++) {
            prop[0].push([variable.properties[propName][i].split("")]);
          }
          break;
        default:
          throw "Unknown property.";
      }
    } catch (ex) {
      throw "Operator Error :: getProperty :: " + ex.toString();
    }

    return prop;
  }

  getProperty.shortHelp = "Returns the specified property from the table.";
  getProperty.help = "# getProperty(A, propName) \n\
Returns the specified property from the table. \n\n";

  return getProperty;

});
