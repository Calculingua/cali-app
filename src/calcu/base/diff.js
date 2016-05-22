define(["./transpose"], function (transpose) {
	
	function __diff(A){
		var i, j;
		var out = [];
		for(i = 0; i < A.length - 1; i++){
			row = [];
			for(j in A[i]){
				row.push(A[i+1][j] - A[i][j]);
			}
			out.push(row);
		}
		return out;
	}
	
	function diff(A, n, dim) {
		
		if(n == null){
			n = [[1]];
		}
		
		if(dim == null){
			if(A.length > 1){
				dim = [[1]];
			}else if(typeof A[0] != "undefined" && A[0].length > 1){
				dim = [[2]];
			}
		}
		
		if(dim[0][0] == 2){
			A = transpose(A);
		}
		// var out = __diff(A);
		
		var out = A, data;
		for(k = 0; k < n[0][0]; k++){
			data = out;
			out = __diff(data);
		}
		if(dim == 2){
			out = transpose(out);
		}
		return out;
	}

	diff.shortHelp = "Computes the difference between the entries in an input.  It's equivalent to a discrete derivative.";
	diff.help = "# diff(A), diff(A, n), diff(A, n, dim)\n \
diff(A) computes the diff of the first dimension with length greater than 1. \n\
diff(A, n) computes the n-th diff.\n\
diff(A, n, dim) computes the n-th diff along the specified dimension.\n";

	return diff;
});