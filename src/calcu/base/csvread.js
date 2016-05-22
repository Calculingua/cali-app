define(["jQuery.parse"], function ($) {
	
	function csvread() {

		var callback = arguments[arguments.length -1];
		var fname = arguments[0][0].join("");
		var startRow = null;
		var startCol = null;
		var range = null;
		if(arguments.length > 2){
			startRow = arguments[1][0];
		}
		if(arguments.length > 3){
			startCol = arguments[2][0];
		}
		if(arguments.length > 4){
			range = arguments[3][0];
			if(range[0] != startRow || range[1] != startCol){
				return callback("R and C should match RANGE");
			}
			if(range.length < 4){
				return callback("RANGE should be length 4");
			}
		}

		this.parser.model.file.readFile(fname, function(err, data) {
			if (err) return callback("Error reading file :: " + fname);

			var csv = $.parse(data, {
				delimiter: ",",
				header : false,
				dynamicTyping: true
			});
			var out = csv.results;
			var i;
			if(range != null){
				out = out.slice(range[0], range[2] + 1);
				for(i = 0; i < out.length; i++){
					out[i] = out[i].slice(range[1], range[3] + 1);
				}
			}else{
				if(startRow != null)
					out = out.slice(startRow);
				if(startCol != null){
					for(i = 0; i < out.length; i++){
						out[i] = out[i].slice(startCol);
					}
				}
			}
		
		
			callback(null, out);
		});
	}

	csvread.async = true;

	csvread.shortHelp = "Imports a commas separated value file.";
	csvread.help = "# csvread(fname) \n \
Imports a comma separated value file into a matrix.\n";

	return csvread;
});