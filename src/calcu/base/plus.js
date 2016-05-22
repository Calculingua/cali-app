define([], function(){
	
	function plus(A, B){
		var out = [];
		var isAMatrix = true, isBMatrix = true;
		if(A.length > 1 || A[0].length > 1){
			if(B.length == 1 && B[0].length == 1){
				isBMatrix = false;
			}
		}else{
			isAMatrix = false;
		}
		var i, j;
		if(isAMatrix && isBMatrix){
			for(i = 0; i < A.length; i++){
				out.push([]);
				for(j = 0; j < A[i].length; j++){
					out[i].push(A[i][j] + B[i][j]);
				}
			}
		}else if(isBMatrix){
			for(i = 0; i < B.length; i++){
				out.push([]);
				for(j = 0; j < B[i].length; j++){
					out[i].push(A[0][0] + B[i][j]);
				}
			}
		}else{
			for(i = 0; i < A.length; i++){
				out.push([]);
				for(j = 0; j < A[i].length; j++){
					out[i].push(A[i][j] + B[0][0]);
				}
			}
		}
		
		return out;
	}
	
	plus.shortHelp = "Adds the two matrices.";
	plus.help = "# plus(A, B) \n \
plus(A, B), adds the two matrices.\n";

	// create the namspace
	return plus;
});