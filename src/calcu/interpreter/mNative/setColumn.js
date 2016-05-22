define([], function () {


	function indexColumns(variable){
		if(variable.properties.VariableNames.length === 0){
			for(i = 0; i < variable.data.length; i++){
				variable.properties.VariableNames.push("Var" + (i + 1));
			}
		}
		
		for(i = 0; i < variable.properties.VariableNames.length; i++){
			if(typeof variable.nameIndex[variable.properties.VariableNames[i]] === "undefined" ||  variable.nameIndex[variable.properties.VariableNames[i]] == i){
				variable.nameIndex[variable.properties.VariableNames[i]] = i;
			}else{
				throw "Operation Error : TABLE : The variable names must be distinct.";
			}
		}
	}

	function setColumn(variable, colName, colValue) {
		
		try{
			colName = colName[0].join("");
			if(variable.data.length > 0 && colValue.length != variable.data[0].length){
				throw "Input variable has the wrong number of rows.";
			}
			if(typeof variable.nameIndex[colName] === "undefined"){
				variable.data.push(colValue);
				variable.properties.VariableNames.push(colName);
				indexColumns(variable);
			}else{
				variable.data[variable.nameIndex[colName]] = colValue;
			}
		}catch(ex){
			throw "Operator Error :: setColumn :: " + ex.toString();
		}
		
		return null;
	}
	
	setColumn.shortHelp = "In the table specified, it sets the colValue as a column with name colName.";
	setColumn.help = "# setColumn(A, colName, colValue) \n\
In the table specified, it sets the colValue as a column with name colName.\n\n";

  return setColumn;

});
