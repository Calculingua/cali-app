define([], function () {
	
	function cos(A) {
		
		var out = [];
		var row;
		for(var i in A){
			row = [];
			for(var j in A[i]){
				row.push(Math.cos(A[i][j]));
			}
			out.push(row);
		}
		return out;
	}
	
	cos.shortHelp = "Computes the trigonometric cosine of a matrix.";
	cos.help = "# cos(A) \n \
Computes the trigonometric cosine of the matrix 'A'. Values are input in radians.\n";

	return cos;
});