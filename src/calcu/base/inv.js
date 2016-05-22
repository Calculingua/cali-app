define([], function(){
	
	function inv(A) {

		return numeric.inv(A);
	}

	inv.shortHelp = "Computes the numberic inverse of the input.";
	inv.help = "# inv(A) \n \
Computes the numeric inverse of the matrix 'A'. \n";

	return inv;
});