define(['../lib/NdArray', '../lib/distributions'], function(NdArray, distributions) {
    var normal = distributions.normal;

    function fill(mat, n) {
        mat.forEach(function(_, idx) { mat.set(idx, n); });
        return mat;
    }


    function normcdf(X, M, S) {
        var cdf = normal.cdf;

        M = M || [[0]];
        S = S || [[1]];

        var Xm = new NdArray(X);
        var Mm = new NdArray(M);
        var Sm = new NdArray(S);

        // Scalar inputs for N and P should be expanded to the size of X
        if (Xm.length > 1 && Mm.length === 1) {
            Mm = fill(new NdArray(new Array(Xm.length), Xm.shape), M[0][0]);
        }
        if (Xm.length > 1 && Sm.length === 1) {
            Sm = fill(new NdArray(new Array(Xm.length), Xm.shape), S[0][0]);
        }

        if (!Xm.sameShape(Mm) || !Xm.sameShape(Sm)) {
            throw new Error("normcdf: X, Mean and StdDev must have the same dimensions.");
        }

        var out = new NdArray(new Array(Xm.length), Xm.shape);
        var m, s;

        Xm.forEach(function(x, idx) {
            m = Mm.get(idx);
            s = Sm.get(idx);
            out.set(idx, cdf(x, m, s));
        });

        return out.toArray();
    }

    function normpdf(X, M, S) {
        var pdf = normal.pdf;

        M = M || [[0]];
        S = S || [[1]];

        var Xm = new NdArray(X);
        var Mm = new NdArray(M);
        var Sm = new NdArray(S);

        // Scalar inputs for N and P should be expanded to the size of X
        if (Xm.length > 1 && Mm.length === 1) {
            Mm = fill(new NdArray(new Array(Xm.length), Xm.shape), M[0][0]);
        }
        if (Xm.length > 1 && Sm.length === 1) {
            Sm = fill(new NdArray(new Array(Xm.length), Xm.shape), S[0][0]);
        }

        if (!Xm.sameShape(Mm) || !Xm.sameShape(Sm)) {
            throw new Error("normpdf: X, Mean and StdDev must have the same dimensions.");
        }

        var out = new NdArray(new Array(Xm.length), Xm.shape);
        var m, s;

        Xm.forEach(function(x, idx) {
            m = Mm.get(idx);
            s = Sm.get(idx);
            out.set(idx, pdf(x, m, s));
        });

        return out.toArray();

    }

    function norminv(P, M, S) {
        var inv = normal.inv;
        
        M = M || [[0]];
        S = S || [[1]];

        var Pm = new NdArray(P);
        var Mm = new NdArray(M);
        var Sm = new NdArray(S);

        if (Pm.length > 1 && Mm.length === 1) {
            Mm = fill(new NdArray(new Array(Pm.length), Pm.shape), M[0][0]);
        }
        if (Pm.length > 1 && Sm.length === 1) {
            Sm = fill(new NdArray(new Array(Pm.length), Pm.shape), S[0][0]);
        }
        
        if (!Pm.sameShape(Mm) || !Pm.sameShape(Sm)) {
            throw new Error("norminv: P, Mean and StdDev must have the same dimensions.");
        }

        
        var out = new NdArray(new Array(Pm.length), Pm.shape);
        var m, s;

        Pm.forEach(function(p, idx) {
            m = Mm.get(idx);
            s = Sm.get(idx);
            out.set(idx, inv(p, m, s));
        });

        return out.toArray();

    }

    normcdf.shortHelp = "Returns the cdf of a normal distribution at each X, given the Mean and Standard Deviation.";
    normpdf.shortHelp = "Returns the pdf of a normal distribution at each X, given the Mean and Standard Deviation.";
    norminv.shortHelp = "Returns the inverse cdf of a normal distribution at each P, given the Mean and Standard Deviation.";

    return {
        normcdf: normcdf,
        normpdf: normpdf,
        norminv: norminv
    };

});