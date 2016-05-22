define([],function(){
	
	function median(A, dim) {
		
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
			vectA.sort();
			if(vectA.length % 2 == 1){
				cc[0] = vectA[vectA.length / 2 - 0.5];
			}else{
				cc[0] = (vectA[vectA.length / 2 - 1] + vectA[vectA.length / 2]) / 2;
			}
		
			if(dimA == 1){
				out[0].push(cc[0]);
			}else{
				out.push(cc);
			}
		}
		
		return out;
	}

	median.shortHelp = "Returns the median value from the input.";
	median.help = "# median(A, dim) \n \
median(A), computes the median along the first dimension that has length greater than 1.\n\
median(A, dim) computes the median along the specified dimension.\n";

	// create the namspace
	return median;
});