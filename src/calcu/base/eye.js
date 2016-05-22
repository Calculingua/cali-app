define([], function(){
	
	function eye(n, m) {

		if (m == null) {
			m = n;
		}
		var out = [];
		for ( var i = 0; i < n; i++) {
			out.push([]);
			for ( var j = 0; j < m; j++) {
				out[i][j] = 0;
				if (i == j) {
					out[i][j] = 1;
				}
			}
		}
		return out;
	}

	eye.shortHelp = "Generates an identity matrix.";
	eye.help = "# eye(width [, height]) \n\
Creates an identity matrix of the given size.  If the height input is \
not specified, a square matrix is created. \n";

	// create the namspace
	return eye;
});