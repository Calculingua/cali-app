define([],function(){

	function xlim() {

		var callback = arguments[arguments.length - 1];

		var h = arguments[0];
		if(!h || !h.viewType || h.viewType != "plot"){
			return callback("Can only add axis limits to a plot.");
		}
		var min, max;
		try{
			var limits = arguments[1];
			if(limits.length > 1){
				min = limits[0][0];
				max = limits[1][0];
			}else if(limits[0].length > 1){
				min = limits[0][0];
				max = limits[0][1];
			}else{
				return callback("Limits must be specified using a vector.");
			}
		}catch(ex){
			return callback("Limits must be specified using a vector.");
		}
		
		if(!h.context.opts){
			h.context.opts = {};
		}
		h.context.opts.xaxis = {
	            min: min,
				max: max
	        };
		
		this.parser.controller.output.editPlot(h.id, h.context.data, h.context.opts, function(err, id) {
			callback(err, null);
		});
	}

	xlim.async = true;
	
	xlim.shortHelp = "Forces the plot to display the specified x-axis limits.";
	xlim.help = "# xlim(h, [xmin, xmax]) \n \
Forces the plot to display the specified x-axis limits.\n";

	return xlim;
});