define([],function(){
	
	function min(A, B, dim) {

		var dimA = 1;
		var i;
		
		var out = [[]];
		var itts, ittsA;
		
		if(dim == 2){
			dimA = 2;
			ittsA = A.length;
		}else if(dim == 1){
			dimA = 1;
			ittsA = A[0].length;
		}else{
			ittsA = A[0].length;
			if(A.length <= 1){
				dimA = 2;
				ittsA = A.length;
			}
		}
		
		if(dimA == 2){
			out = [];
		}
		
		var vectA;
		
		var k = 0;
		var kA;
		itts = ittsA;
		
		if(B && B.length > 0){
			out = [];
			if(B.length == 1 && B[0].length == 1){
				for(i = 0; i < A.length; i++){
					out.push([]);
					for(j = 0; j < A[i].length; j++){
						out[i][j] = A[i][j] < B[0][0] ? A[i][j] : B[0][0];
					}
				}
			}else{
				for(i = 0; i < A.length; i++){
					out.push([]);
					for(j = 0; j < A[i].length; j++){
						out[i][j] = A[i][j] < B[i][j] ? A[i][j] : B[i][j];
					}
				}
			}
		}else{
			for(k; k < itts; k++){
				kA = k;
				if(ittsA == 1){
					kA = 0;
				}
				vectA = [];
				if(dimA == 2){
					for(i = 0; i < A[kA].length; i++){
						vectA.push(A[kA][i]);
					}
				}else{
					for(i = 0; i < A.length; i++){
						vectA.push(A[i][kA]);
					}
				}
		
				var cc = [];
				cc[0] = vectA[0];
				for(i = 1; i < vectA.length; i++){
					cc[0] = vectA[i] < cc[0] ? vectA[i] : cc[0];
				}
				// cc[0] /= vectA.length;
		
				if(dimA == 1){
					out[0].push(cc[0]);
				}else{
					out.push(cc);
				}
			}
				
		}
		return out;
	}

	min.shortHelp = "Returns the minimum value from the input.";
	min.help = "# min(A, B, dim) \n \
min(A), computes the min along the columns of A.\n\
min(A, B) returns a matrix that is the min of A and B.\n\
min(A, [], dim) return the minimum value along the specified dimension.\n";

	return min;
});