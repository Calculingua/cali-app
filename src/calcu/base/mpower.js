define(["numeric", "./mtimes", "./eye"], function(numeric, mtimes, eye){

    function expBySquaring(A, k, n) {
        n = n || numeric.dim(A)[0];

        if (k<0) {
            return expBySquaring(numeric.inv(A), -1*k, n);
        } else if (k === 0) {
            return eye(n);
        } else if (k===1) {
            return A;
        } else if (k%2===0) {
            return expBySquaring(mtimes(A,A), k/2, n);
        } else {
            return mtimes(A, expBySquaring(mtimes(A,A), (k-1)/2, n ));
        }
    }

    // From:
    // AN IMPROVED SCHUR–PADE ALGORITHM FOR FRACTIONAL ´
    // POWERS OF A MATRIX AND THEIR FRECHET DERIVATIVES
    // SIAM J. MATRIX ANAL. APPL. Vol. 34, No. 3, pp. 1341–1360
    // http://eprints.ma.man.ac.uk/2021/01/covered/MIMS_ep2013_1.pdf
    function schurPade() {} // TODO

    
    function mpower(A, k) {
        var dim = numeric.dim(A);
        if (dim[0] !== dim[1]) {
            throw "Operator Error :: MPOWER : matrix is not square";
        }

        if (k === Math.floor(k)) {
            return expBySquaring(A, k);
        } else {
            var eig = numeric.eig(A);
            // check for eigenvalues which are real (no numeric.T.y values)
            if (eig.lambda.x.length && (!eig.lambda.y || eig.lambda.y.length===0)) {
                var P = numeric.rep([eig.lambda.x.length], k);
                return eig.E.
                    dot(numeric.T.diag(numeric.pow(eig.lambda.x, P))).
                    dot(eig.E.inv()).x;
            } else {
                throw "Operator Error :: MPOWER : non-integer power, matric has complex eigenvalues";
            }
        }
    }

	mpower.shortHelp = "Computes the matrix power for the inputs.";
  mpower.help = "# mpower(A, k) \n \
Computes A to the k power and returns the result. \n";


  // create the namspace
  return mpower;
});