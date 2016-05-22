define([], function () {
	
	function cross(A, B, dim) {
		
		var dimA = 1;
		var dimB = 1;
		var i;
		
		var out = [];
		var itts, ittsA, ittsB;
		
		if(dim == 2){
			dimA = 2;
			dimB = 2;
			ittsA = A.length;
			ittsB = B.length;
		}else if(dim == 1){
			dimA = 1;
			dimB = 1;
			ittsA = A[0].length;
			ittsB = B[0].length;
		}else{
			ittsA = A[0].length;
			if(A.length != 3 && A[0].length == 3){
				dimA = 2;
				ittsA = A.length;
			}
		
			ittsB = B[0].length;
			if(B.length != 3 && B[0].length == 3){
				dimB = 2;
				ittsB = B.length;
			}
		}
		
		if(dimA == 1 && dimB == 1){
			out = [[], [], []];
		}
		
		var vectA, vectB;
		
		var k = 0;
		var kA, kB;
		if(ittsA == 1 && ittsB > 1){
			itts = ittsB;
		}else if(ittsA > 1 && ittsB == 1){
			itts = ittsA;
		}else if(ittsA == ittsB){
			itts = ittsA;
		}else{
			throw "Error in Cross: Matrix dimension mismatch.";
		}
		
		for(k; k < itts; k++){
			kA = k;
			kB = k;
			if(ittsA == 1){
				kA = 0;
			}
			if(ittsB == 1){
				kB = 0;
			}
			vectA = [];
			if(dimA == 2){
				for(i = 0; i < 3; i++){
					vectA.push(A[kA][i]);
				}
			}else{
				for(i = 0; i < 3; i++){
					vectA.push(A[i][kA]);
				}
			}

			vectB = [];
			if(dimB == 2){
				for(i = 0; i < 3; i++){
					vectB.push(B[kB][i]);
				}
			}else{
				for(i = 0; i < 3; i++){
					vectB.push(B[i][kB]);
				}
			}
		
			var cc = [];
			cc[0] = vectA[1]*vectB[2] - vectA[2]*vectB[1];
			cc[1] = vectA[2]*vectB[0] - vectA[0]*vectB[2];
			cc[2] = vectA[0]*vectB[1] - vectA[1]*vectB[0];
		
		
			if(dimA == 1 && dimB == 1){
				for(i = 0; i < 3; i++){
					out[i].push(cc[i]);
				}
			}else{
				out.push(cc);
			}
		}
		
		return out;
	}

	cross.shortHelp = "Computes the cross-product of the input vectors.";
	cross.help = "# cross(A, B, dim) \n \
cross(A, B), when A and B are 3 dimensional vectors, computes the cross product of the vectors.\n\
cross(A, B), when A and B are matrices, it computes the cross product of their vectors.  \n\
One dimension of each matrix must be equal to 3.\n\
cross(A, B, dim) computes the cross product of the vectors along the specified dimension.\n";

	return cross;
});