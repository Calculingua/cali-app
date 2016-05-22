define([
], function () {

	function asin(A) {
		
		var out = [];
		var row;
		for(var i in A){
			row = [];
			for(var j in A[i]){
				row.push(Math.asin(A[i][j]));
			}
			out.push(row);
		}
		return out;
	}
	asin.shortHelp = "Computes the trigonometric arc-sine of a matrix.";
	asin.help = "# asin(A) \n \
Computes the trigonometric arc sine of the matrix 'A'. \n";



  return asin;

});