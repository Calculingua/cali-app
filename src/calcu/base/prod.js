define([],function(){
	
	function prod(A, dim) {
		
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
				for(j in A[i]){
					out[0][j] *= A[i][j];
				}
			}
		}else if(dim == 2){
			for(i in A){
				out.push([A[i][0]]);
			}
			for(i in A){
				for(j = 1; j < A[i].length; j++){
					out[i][0] *= A[i][j];
				}
			}
		}else{
			out.push([0]);
		}
		return out;
	}

	prod.shortHelp = "Computes the product of the columns/rows in the input.";
	prod.help = "# prod(A), prod(A, dim)\n \
prod(A) computes the product of the first dimension with length greater than 1. \n\
prod(A, dim) computes the product of the dimension specified.\n";

	return prod;
});