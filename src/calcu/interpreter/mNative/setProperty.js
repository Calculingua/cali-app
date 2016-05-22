define([], function () {

	function setProperty(variable, propName, propValue) {
		
		try{
			propName = propName[0].join("");
			var prop;
			switch(propName){
			case "VariableNames":
			case "RowNames":
			case "VariableDescriptions":
			case "VariableUnits":
				variable.properties[propName] = [];
				for(var i = 0; i < propValue[0].length; i++){
					variable.properties[propName].push(propValue[0][i][0].join(""));
				}
				break;
			default:
				variable.data[variable.nameIndex[propName]] = propValue;
				break;
			}
			
		}catch(ex){
			throw "Error accessing property.";
		}
		
		return null;
	}
	
	setProperty.shortHelp = "In the table specified, it sets the value in the corresponding property.";
	setProperty.help = "# setProperty(A, propName, propValue) \n\
In the table specified, it sets the value in the corresponding property.\n\n";

  return setProperty;

});