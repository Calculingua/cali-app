define([], function () {
	
	function csvwrite() {

		var callback = arguments[arguments.length -1];
		var fname = arguments[0][0].join("");
		var M = arguments[1];
		var startRow = 0;
		var startCol = 0;
		var range = null;
		var i;
		if(arguments.length > 3){
			startRow = arguments[2][0][0];
		}
		if(arguments.length > 4){
			startCol = arguments[3][0][0];
		}

		for(i = 0; i < startRow; i++){
			M[i] = new Array(M[i].length);
		}
		if(startCol > 0){
	//		var head = new Array(startCol);
			for(i = 0; i < M.length; i++){
				var head = new Array(startCol);
				M[i] = head.concat(M[i].slice(startCol));
			}
		}
		var txt = "";
		for(i = 0; i < M.length; i++){
		
			txt += (M[i].join(",") + "\n");
		}
	
		this.parser.model.file.saveFile(fname, txt, function(err, data) {
		
			callback(null, [fname.split("")]);
		});
	}

	csvwrite.async = true;

	csvwrite.shortHelp = "Writes a matrix to a comma separated value file. ";
	csvwrite.help = "# csvwrite(fname, M) \n \
Exports a matrix to a comma separated value file.\n";


	return csvwrite;
});