define([],function(){
	
	function sum(A, dim) {
		
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
					out[0][j] += A[i][j];
				}
			}
		}else if(dim == 2){
			for(i in A){
				out.push([A[i][0]]);
			}
			for(i in A){
				for(j = 1; j < A[i].length; j++){
					out[i][0] += A[i][j];
				}
			}
		}else{
			out.push([0]);
		}
		return out;
	}

	sum.shortHelp = "Computes the sum of the input.";
	sum.help = "# sum(A), sum(A, dim)\n \
sum(A) computes the sum of the first dimension with length greater than 1. \n\
sum(A, dim) computes the sum of the dimension specified.\n";

	return sum;
});