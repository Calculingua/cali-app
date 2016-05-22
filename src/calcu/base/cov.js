define(["./reshape", "./transpose", "./mean", "./minus", "./mtimes", "./repmat", "./size"], 
	function (reshape, transpose, mean, minus, mtimes, repmat, size) {
	
	function cov(A, B, flag) {
		
		var out = [];
		var k, i, j;
		
		if(flag == null && B && B.length == 1 && B[0].length == 1){
			flag = B;
		}
		
		var meanA, meanB, x, y;
		if(B && B.length == A.length && B[0].length == A[0].length){
			var AA = reshape(A, [[1]], [[]]);
			var BB = reshape(B, [[1]], [[]]);
			A = transpose([AA[0], BB[0]]);
			
		}
		meanA = mean(A);
		x = minus(A, repmat(meanA, [[A.length, 1]]));
		out = mtimes(transpose(x), x);
		
		var scale;
		if(flag && flag[0][0] == 1){
			scale = [[1/(size(A)[0][0])]];
		}
		else{
			scale = [[1/(size(A)[0][0] - 1)]];
		}
		out = mtimes(scale, out);
		
		return out;
	}

	cov.shortHelp = "Computes the covariance matrix.";
	cov.help = "# cov(A, B, flag) \n \
cov(A), computes the covariance matrix along the rows of A.\n\
cov(A, 1), computes the covariance matrix along the rows of A using N for normalization.\n\
cov(A, B), computes the covariance of the data, considering A and B as independent data sets.\n\
cov(A, B, 1), computes cov(A, B), but using N for normalization.\n";

	return cov;
});