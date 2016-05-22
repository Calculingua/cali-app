define(["./cov"], function (cov) {
	
	function corrcoef(A, B) {
		
		var out = [];
		var X = cov(A, B);
		for(var i = 0; i < X.length; i++){
			out.push([]);
			for(var j = 0; j < X[i].length; j++){
				out[i].push(X[i][j] / Math.sqrt(X[i][i] * X[j][j]));
			}
		}
		
		return out;
	}

	corrcoef.shortHelp = "Computes the correlation coefficient.";
	corrcoef.help = "# corrcoef(A, B) \n \
corrcoef(A), computes the correlation coefficient along the rows of A.\n\
corrcoef(A, B), computes the correlation coefficient of the data, considering A and B as independent data sets.\n";

	return corrcoef;
});