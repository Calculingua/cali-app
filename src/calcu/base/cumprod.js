define([], function () {
	
	function cumprod(A, dim) {
		
		if(dim == null){
			if(A.length > 1){
				dim = 1;
			}else if(typeof A[0] != "undefined" && A[0].length > 1){
				dim = 2;
			}
		}
		var out = [];
		var i, j;
		if(dim == 1){
			out.push([]);
			for(j in A[0]){
				out[0].push(A[0][j]);
			}
			for(i = 1; i < A.length; i++){
				out.push([]);
				for(j in A[i]){
					out[i][j] = A[i][j] * out[i-1][j];
				}
			}
		}else if(dim == 2){
			for(i in A){
				out.push([A[i][0]]);
			}
			for(i in A){
				for(j = 1; j < A[i].length; j++){
					out[i][j] = A[i][j] * out[i][j-1];
				}
			}
		}else{
			out.push([0]);
		}
		return out;
	}

	cumprod.shortHelp = "Computes the running cumulative product of an input.";
	cumprod.help = "# cumprod(A), cumprod(A, dim)\n \
cumprod(A) computes the cumulative product of the first dimension with length greater than 1. \n\
cumprod(A, dim) computes the cumulative product of the dimension specified.\n";

	return cumprod;
});