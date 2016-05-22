define([],function(){

	function legend() {

		var callback = arguments[arguments.length - 1];

		var h = arguments[0];
		var leg = [];
		var i;
		if(arguments[1] && arguments[1].type == "CELL_ARRAY"){
			for(i = 0; i < arguments[1].length; i++){
				for(j = 0; j < arguments[1][i].length; j++){
					leg.push(arguments[1][i][j]);
				}
			}
		}else{
			for(i = 1; i < arguments.length -1; i++){
				leg.push(arguments[i]);
			}
		}
		
		if(h.viewType != "plot"){
			return callback("Can only add a legend to a plot.");
		}
		
		if(leg.length !== h.context.data.length){
			return callback("Number of labels in the legend must equal the number of lines on the plot.");
		}
		for(var k in leg){
			h.context.data[k].label = leg[k][0].join("");
		}
		this.parser.controller.output.editPlot(h.id, h.context.data, h.context.opts, function(err, id) {
			
			callback(err, null);
		});
	}

	legend.async = true;

	legend.shortHelp = "Adds a legend to a plot.";
	legend.help = "# legend(h, str1, str2, ...), legend(h, {str1, str2, ...}) \n \
Adds the strN legend labels to the plot. \n";

	return legend;

});