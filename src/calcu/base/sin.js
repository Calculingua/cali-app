define([],function(){
	
	function sin(A) {
		
		var out = [];
		var row;
		for(var i in A){
			row = [];
			for(var j in A[i]){
				row.push(Math.sin(A[i][j]));
			}
			out.push(row);
		}
		return out;
	}

	sin.shortHelp = "Computes the trigonometric sine of the input.";
	sin.help = "# sin(A) \n \
Computes the trigonometric sine of the matrix 'A'. Values are input in radians.\n";

	return sin;
});