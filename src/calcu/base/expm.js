define(["numeric", "./mtimes", "./mpower", "./minus", "./plus"], function(numeric, mtimes, mpower, sub, plus){
	
	var I = numeric.identity;
	var inv = numeric.inv;

    var theta = {
        3: 0.01495585217958292,
        5: 0.25393983300632301,
        7: 0.95041789961629321,
        9: 2.097847961257068,
        13: 5.371920351148152,
    };

    var b13 = [
        64764752532480000,
        32382376266240000,
        7771770303897600,
        1187353796428800,
        129060195264000,
        10559470521600,
        670442572800,
        33522128640,
        1323241920,
        40840800,
        960960,
        16380,
        182,
        1,
    ];

    b9 = [
        17643225600,
        8821612800,
        2075673600,
        302702400,
        30270240,
        2162160,
        110880, 
        3960, 
        90, 
        1
    ];

    b = b13;
    b = b9;
    

    // http://eprints.ma.man.ac.uk/634/01/covered/MIMS_ep2006_394.pdf
    function expm(A) {

        var m;
        var s = 0;
        var dim = numeric.dim(A)[0];
        var nA = numeric.norm2(A);

        // We can make this function more efficient for matrices with smaller
        // normals (ie ||A|| < theta[m] where m < 13), but for the sake of
        // getting something up and running, we'll just peg m=13 for now.
        // for (var _m in theta) {
        //     if (nA <= theta[_m]) {
        //         m = _m;
        //         break;
        //     }
        // }
        m=13;
        // HAHA, Just kidding. m=13 produces numbers which exceed Javascript's max safe integer
        // Let's try m=9
        m=9;

        // if ||A|| exceeds theta[m], use the scale and square method
        if (nA > theta[m]) {
            s = Math.ceil(log2(nA/theta[m]));
            A = mult(A, 1/Math.pow(2, s));
        }

        var U, V, u1, v1, A2, A4, A6, A8;
        if (m===9) {
            A2 = mpower(A,2);
            A4 = mpower(A2,2);
            A6 = mtimes(A2, A4);
            A8 = mpower(A4,2);

            u1 = add(
                    mult(A8, b[9]), 
                    mult(A6, b[7]), 
                    mult(A4, b[5]), 
                    mult(A2, b[3]), 
                    mult(I(dim), b[1])
            );
            U = mtimes(A, u1);

            V = add(    mult(A8, b[8]),
                        mult(A6, b[6]),
                        mult(A4, b[4]),
                        mult(A2, b[2]), 
                        mult(I(dim), b[0]) 
            );

        } else if (m===13) {
            /**
             * R13
             */
            A2 = mpower(A,2);
            A4 = mpower(A2,2);
            A6 = mtimes(A2, A4);


            u1 = mult(A6, b[13]);
            var u2 = mult(A4, b[11]);
            var u3 = mult(A2, b[9]);
            var u4 = mult(A6,b[7]);
            var u5 = mult(A4,b[5]);
            var u6 = mult(A2, b[3]);
            var u7 = mult(I(dim), b[1]);

            // console.log("a2*b9 1 1", u3[0][0]);

            var U1 = mtimes(A6, add(u1, add(u2, u3)) );
            U = mtimes(A, add(U1, add(u4, add(u5, add(u6, u7)))));

            v1 = mult(A6, b[12]);
            var v2 = mult(A4, b[10]);
            var v3 = mult(A2, b[8]);
            var v4 = mult(A6, b[6]);
            var v5 = mult(A4, b[4]);
            var v6 = mult(A2, b[2]);
            var v7 = I(dim);
            var V1 = mtimes(A6, add(v1, add(v2, v3)));
            V = add(V1, add(v4, add(v5, add(v6, v7))));
        }

        var P = sub(V,U);
        var Q = add(V,U);
        // Solves the equation (-U + V)x = (U + V)
        
        // Here's where one would use MATLAB's '/' operator or mldivide() to solve the
        // equation PX=Q.  However, right now we don't have such a function and numeric's
        // LUSolve & solve functions only solve Ax=b (x and b are vectors, not matrices).
        // 
        // The following is a quick way to get something working.  This is a terrible 
        // long terms solution.
        // 
        // Really, I feel just awful about it.
        var X = mtimes(inv(P),Q);

        // undo the scaling by repeated squaring
        if (s>0) {
            X = mpower(X, Math.pow(2,s));
        }

        return X;
    }

    function mult(A, n) {
        var dim = numeric.dim(A);
        var out = [];
        for (var i=0; i<dim[0]; i++) {
            out.push([]);
            for (var j=0; j<dim[1]; j++) {
                out[i][j] = A[i][j] * n;
            }
        }
        return out;
    }

    function add() {
        if (arguments.length === 0) {
            return [[]];
        }
        var args = Array.prototype.splice.call(arguments, 0);
        var out = args.splice(0,1)[0];
        for (var i=0; i<args.length; i++) {
            out = plus(out, args[i]);
        }
        return out;
    }

    function log2(x) {
        return Math.log(x) / Math.LN2;
    }


	expm.shortHelp = "Computes matrix exponential.";
  expm.help = "# expm(A) \n \
Computes the matrix exponential of matrix 'A'. \n";

  return expm;
});