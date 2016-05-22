define([], function(){
	
	function power(A, B) {
		
		var out = [];
		var row, b;
		if(!A || !B || A.type || B.type){
			throw "Operator Error : power : Only matrix inputs are allowed.";
		}
		if(B.length == 1 && B[0].length == 1){
			b = B[0][0];
		}else{
			if(B.length !== A.length || B[0].length !== A[0].length){
				throw "Operator Error : power : Matrices are miss-sized.";
			}
		}
		for(var i = 0; i < A.length; i++){
			row = [];
			for(var j = 0; j < A[0].length; j++){
				
				row.push(Math.pow(A[i][j], b || B[i][j]));
			}
			out.push(row);
		}
		return out;
	}

	power.shortHelp = "On an element-wise basis, raises the first input to the power of the second.";
	power.help = "# power \n \
power(A, B) raises each element of A to the corresponding power of B.\n";

	function exp(A){
		var out = [];
		var row;
		
		if(!A || A.type){
			throw "Operator Error : exp : Only matrix inputs are allowed.";
		}
		for(var i = 0; i < A.length; i++){
			row = [];
			for(var j = 0; j < A[0].length; j++){
				row.push(Math.exp(A[i][j]));
			}
			out.push(row);
		}
		return out;
	}
	
	exp.shortHelp = "On an element-wise basis, raises e to the power of the input.";
	exp.help = "# exp \n \
exp(A) raises e to the power of each element of A.\n";

	function sqrt(A){
		var out = [];
		var row;
		
		if(!A || A.type){
			throw "Operator Error : sqrt : Only matrix inputs are allowed.";
		}
		for(var i = 0; i < A.length; i++){
			row = [];
			for(var j = 0; j < A[0].length; j++){
				row.push(Math.sqrt(A[i][j]));
			}
			out.push(row);
		}
		return out;
	}
	sqrt.shortHelp = "On an element-wise basis, computes the square-root of the input.";
	sqrt.help = "# sqrt \n \
exp(A) computes the square-root of each element of A.\n";

	out = {};
	out.power = power;
	out.exp = exp;
	out.sqrt = sqrt;
	return out;
});