define([],function(){
	
	function mode(A, dim) {
		
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
			
			vectA.sort();
			cc[0] = vectA[0];
			var cnt = 0;
			var max = 0;
			for(i = 1; i < vectA.length; i++){
				if(vectA[i] == vectA[i-1]){
					cnt++;
				}else{
					cnt = 0;
				}
				if(cnt > max){
					cc[0] = vectA[i];
					max = cnt;
				}
			}
		
			if(dimA == 1){
				out[0].push(cc[0]);
			}else{
				out.push(cc);
			}
		}
		
		return out;
	}

	mode.shortHelp = "Returns the mode of the input.";
	mode.help = "# mode(A, dim) \n \
mode(A), computes the mode along the first dimension that has length greater than 1.\n\
mode(A, dim) computes the mode along the specified dimension.\n";

	return mode;
});