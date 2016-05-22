define([],function(){
	
	function vectfunc(func, dim, args) {
		
		var i;
		var k;
		var itt;
		var dims = [];
		var out = [];
		var itts = [];
		var vects = [];
		var ks = [];
		for(i = 0; i < args.length; i++){
			dims.push(1);
			itts.push(0);
		}
		
		if(dim == 2){
			for(i = 0; i < args.length; i++){
				dims[i] = 2;
				itts[i] = args[i].length;
			}
		}else if(dim == 1){
			for(i = 0; i < args.length; i++){
				dims[i] = 1;
				itts[i] = args[i][0].length;
			}
		}else{
			for(i = 0; i < args.length; i++){
				itts[i] = args[i][0].length;
				if(args[i].length != 3 && args[i][0].length == 3){
					dims[i] = 2;
					itts[i] = args[i].length;
				}
			}
		}
		
		var dimesOne = true;
		for(i = 0; i < args.length; i++){
			dimsOne &= (dims[i] == 1); 
		}
		if(dimesOne){
			out = [[], [], []];
		}
		
		k = 0;
		
		if(ittsA == 1 && ittsB > 1){
			itt = ittsB;
		}else if(ittsA > 1 && ittsB == 1){
			itt = ittsA;
		}else if(ittsA == ittsB){
			itt = ittsA;
		}else{
			throw "Error in Cross: Matrix dimension mismatch.";
		}
		
		for(k; k < itt; k++){
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

	return vectfunc;
});