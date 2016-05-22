define([],function(){

	function xlabel() {

		var callback = arguments[arguments.length - 1];

		var h = arguments[0];
		if(!h || !h.viewType || h.viewType != "plot"){
			return callback("Can only add a label to a plot.");
		}
		var label;
		try{
			label = arguments[1][0].join("");
		}catch(ex){
			return callback("Label must be specified using a string.");
		}
		
		if(h.viewType != "plot"){
			return callback("Can only add a xlabel to a plot.");
		}
		
		if(!h.context.opts){
			h.context.opts = {};
		}
		h.context.opts.axisLabels = {
	            show: true
	        };
        h.context.opts.xaxes = [{
	            axisLabel: label,
	        }];
		
		this.parser.controller.output.editPlot(h.id, h.context.data, h.context.opts, function(err, id) {
			callback(err, null);
		});
	}

	xlabel.async = true;

	xlabel.shortHelp = "Adds a label to the x-axis of the plot.";
	xlabel.help = "# xlabel(h, str) \n \
Adds a label to the x axis of the specified plot. \n";

	return xlabel;
});