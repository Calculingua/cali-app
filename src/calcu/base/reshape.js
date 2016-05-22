define([], function () {
	
	function reshape(A, m, n){
		var mm = m[0][0];
		var nn;
		if(n && n.length){
			nn = n[0][0];
		}else{
			nn = m[0][1];
		}
		var out = [];
		var i, j, ii = 0, jj = 0;
		if(mm && nn && mm * nn !== A.length * A[0].length){
			throw "Error with reshape: dimension mismatch";
		}
		for(j = 0; j < A[0].length; j++){
			for(i = 0; i < A.length; i++){
				if(mm && ii >= mm){
					ii = 0;
					jj += 1;
					if(nn && jj >= nn){
						return out;
					}
				}
				if(nn && jj >= nn){
					jj = 0;
					ii += 1;
					if(mm && ii >= mm){
						return out;
					}else{
						out.push([]);
					}
				}
				if(ii >= out.length){
					out.push([]);
				}
				out[ii][jj] = A[i][j];
				ii += 1;
			}
		}
		return out;
	}
	
	reshape.shortHelp = "Reshapes the matrix to be the specified shape.";
	reshape.help = "# reshape(A, m, n)\n \
reshape(A, m, n) reshapes the matrix A to be of dimensions mxn. \n\
reshape(A, [m, n]) reshapes the matrix A to be of dimensions mxn. \n";

	return reshape;
});