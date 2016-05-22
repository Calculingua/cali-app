define(["../../mType/CellArrayType"], function(CellArrayType){

	function categories(variable) {
		
		var prop = [[]];
		try{
			if(variable.properties && variable.properties.values){
				for(var i = 0; i < variable.properties.values.length; i++){
					if(typeof variable.properties.values[i] == "string"){
						prop[0].push([variable.properties.values[i].split("")]);
					}else{
						prop[0].push([[variable.properties.values[i]]]);
					}
				
				}
			}else{
				throw "Variable does not have any categories.";
			}
			
		}catch(ex){
			throw "Operator Error :: categories :: " + ex.toString();
		}
		
		return new CellArrayType(prop);
	}
	
	categories.shortHelp = "List the categories for the categorical variable.";
	categories.help = "# categories(A) \n\
List the categories for the categorical variable. \n\n";

	return categories;

});
