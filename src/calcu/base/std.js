define(['./mean'],function(mean){
	
	function std(A, flag, dim) {
		
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
		
		var means = mean(A, dim);
		var mu;
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
				mu = means[kA][0];
			}else{
				for(i = 0; i < A.length; i++){
					vectA.push(A[i][kA]);
				}
				mu = means[0][kA];
			}
	
			var cc = [];
			cc[0] = 0;
			for(i = 0; i < vectA.length; i++){
				cc[0] += Math.pow(vectA[i] - mu, 2);
			}
			if(flag){
				cc[0] = Math.sqrt(cc[0] / (vectA.length) );
			}else{
				cc[0] = Math.sqrt(cc[0] / (vectA.length - 1));
			}
	
			if(dimA == 1){
				out[0].push(cc[0]);
			}else{
				out.push(cc);
			}
		}
		return out;
	}

	std.shortHelp = "Computes the standard deviation along the specified dimension of the input.";
	std.help = "# std(A, flag, dim) \n \
std(A), computes the standard deviation along the columns of A.\n\
std(A, flag) computes the standard deviation of the columns of A. When flag == 0 it \n\
uses the same as std(A) which is the (1/n-1)formula (1/n) formula. \n\
When flag == 1 it uses the (1/n) formula.\n\
std(A, flag, dim) returns the standard deviation value along the specified dimension.\n";

	return std;
});