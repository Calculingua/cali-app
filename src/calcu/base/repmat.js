define([], function () {
	
	function repmat(A, sz1, sz2){
		var ni = sz1[0][0];
		var nj = sz2 ? sz2[0][0] : null;
		if(nj == null){
			if(sz1[0].length > 1){
				nj = sz1[0][1];
			}else{
				nj = ni;
			}
		}
		var out;
		var ki, kj, i, j;
		
		out = [];
		for(ki = 0; ki < ni * A.length; ki += A.length){
			for(i = 0; i < A.length; i++){
				out.push([]);
				for(kj = 0; kj < nj; kj++){
					for(j = 0; j < A[i].length; j++){
						out[ki+i].push(A[i][j]);
					}
				}
			}
		}
		
		return out;
	}
	
	repmat.shortHelp = "Constructs a matrix from the input value by repeating it.";
	repmat.help = "# repmat(A, n)\n \
repmat(A, n) returns a new matrix build by repeating A n x n times.\n\
repmat(A, sz1, sz2) returns a new matrix build by repeating A sz1 x sz2 times.\n\
repmat(A, [sz1, sz2]) returns a new matrix build by repeating A sz1 x sz2 times.\n";

	return repmat;
});