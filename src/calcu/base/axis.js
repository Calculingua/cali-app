define([
], function () {

  function axis() {

		var callback = arguments[arguments.length - 1];

		var h = arguments[0];
		if(!h || !h.viewType || h.viewType != "plot"){
			return callback("Can only add axis limits to a plot.");
		}
		var xmin, xmax, ymin, ymax;
		try{
			var limits = arguments[1];
			if(limits.length > 1){
				xmin = limits[0][0];
				xmax = limits[1][0];
				ymin = limits[2][0];
				ymax = limits[3][0];
			}else if(limits[0].length > 1){
				xmin = limits[0][0];
				xmax = limits[0][1];
				ymin = limits[0][2];
				ymax = limits[0][3];
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
	            min: xmin,
				max: xmax
	        };
		h.context.opts.yaxis = {
	            min: ymin,
				max: ymax
	        };
		
		this.parser.controller.output.editPlot(h.id, h.context.data, h.context.opts, function(err, id) {
			callback(err, null);
		});
	}

	axis.async = true;
	
	axis.shortHelp = "Modifies the axis limits of a plot.";
	axis.help = "# axis(h, [xmin, xmax, ymin, ymax]) \n \
Forces the plot to display the specified axis limits.\n";


  return axis;

});