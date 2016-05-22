define([], function(){
	
	function mean(A, dim) {
		
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
			cc[0] = 0;
			for(i = 0; i < vectA.length; i++){
				cc[0] += vectA[i];
			}
			cc[0] /= vectA.length;
		
			if(dimA == 1){
				out[0].push(cc[0]);
			}else{
				out.push(cc);
			}
		}
		
		return out;
	}

	mean.shortHelp = "Returns the average value from the input.";
	mean.help = "# mean(A, dim) \n \
mean(A), computes the mean along the first dimension that has length greater than 1.\n\
mean(A, dim) computes the mean along the specified dimension.\n";

	return mean;
});