define(['../lib/NdArray', '../lib/distributions'], function(NdArray, distributions) {

    function fill(mat, n) {
        mat.forEach(function(_, idx) { mat.set(idx, n); });
        return mat;
    }


    function poissFn(fn, X, L) {
        var NdArray = NdArray;

        L = L || [[1]];

        var Xm = new NdArray(X);
        var Lm = new NdArray(L);

        // Scalar inputs for N and P should be expanded to the size of X
        if (Xm.length > 1 && Lm.length === 1) {
            Lm = fill(new NdArray(new Array(Xm.length), Xm.shape), M[0][0]);
        }

        if (!Xm.sameShape(Lm)) {
            throw new Error("poisson: X and L must have the same dimensions.");
        }

        var out = new NdArray(new Array(Xm.length), Xm.shape);
        var l;

        Xm.forEach(function(x, idx) {
            l = Lm.get(idx);
            out.set(idx, fn(x, l));
        });

        return out.toArray();
    }

    function poisscdf(X, L) { return poissFn(distributions.poisson.cdf, X, L); }
    function poisspdf(X, L) { return poissFn(distributions.poisson.pdf, X, L); }
    function poissinv(X, L) { return poissFn(distributions.poisson.inv, X, L); }

    poisscdf.shortHelp = "Returns the cdf of a poisson distribution at each X, given the Mean and Standard Deviation.";
    poisspdf.shortHelp = "Returns the pdf of a poisson distribution at each X, given the Mean and Standard Deviation.";
    poissinv.shortHelp = "Returns the inverse cdf of a poisson distribution at each P, given the Mean and Standard Deviation.";

    return {
        poisscdf: poisscdf,
        poisspdf: poisspdf,
        poissinv: poissinv
    };
});