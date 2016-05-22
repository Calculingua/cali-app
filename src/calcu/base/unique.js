define(["./size", "./transpose"], function(size, transpose){
    
    function unique(A, callback) {
        var i;
        var sz = size(A);
        var dim = (sz[0][0] === 1 && sz[0][1] >= 1) ? 2 /*column*/ : (sz[0][0] >= 1 && sz[0][1] === 1) ? 1 /*row*/ : null;
        if (!dim) {
            return callback(new Error("Argument Error :: UNIQUE : A must be a vector, not a matrix"));
        } else if (dim === 1) {
            A = transpose(A);
        }

        var C = [], ia = [], ic = [];
        for (i=0;i<A[0].length;i++) {
            var val = A[0][i];
            if (C.indexOf(val) === -1) {
                C.push(val);
                // ia.push(i);
            }
        }

        C = C.sort();
        for (i=0; i<A[0].length; i++) {
            ic.push(C.indexOf(A[0][i]));
        }
        for(i=0; i<C.length; i++) {
            ia.push(A[0].indexOf(C[i]));
        }



        C = [C];
        ia = [ia];
        ic = [ic];

        callback(null, C, ia, ic);

    }
    unique.async = true;
	
	unique.shortHelp = "Returns the same data as the input, but with no repetitions.";
    unique.help = "#C = unique(A) \n \
returns the same data as in A, but with no repetitions. \n \
If A is a numeric array, logical array, character array, categorical array, or a cell array of strings, \
then C = A(ia) and A = C(ic). \n\n";

    return unique;

});