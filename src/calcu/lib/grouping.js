define([
  "./NdArray",
  "./NumericNdArray",
  "./Matrix"
], function (NdArray, NumericNdArray, Matrix) {

    /**
     * Returns an array of indexes C which map B on to A such that B[C] = A
     * IOW: for each element in A, answer: Where, in B, is A[i]
     */
    function mapIndex(A, B) {
      if (A instanceof NdArray) {
        A = A.toArray();
      }
      if (B instanceof NdArray) {
        B = B.toArray();
      }
        return A.map(function(a) {
            return B.indexOf(a);
        });
    }

    /**
     * Returns an ndarray of unique values in A
     */
    function unique(A) {
      if (A instanceof NdArray) {
        A = A.toArray();
      }

        var hash = {}, result = [];
        for ( var i = 0, l = A.length; i < l; ++i ) {
            if ( !hash.hasOwnProperty(A[i]) ) { 
                hash[ A[i] ] = true;
                result.push(A[i]);
            }
        }
        return result;
    }

    function grp2idx(grp) {
        var sorters = {
            "number": function(a, b) { return a-b; },
            "string": null,
            "object": null
        };

        var sorter = typeof grp[0];
        

        var copy = grp.map(function(g) { return g; });
        copy.sort(sorters[sorter]);
        copy = unique(copy);

        return mapIndex(grp, copy);
    }

    /**
     * Convert an array and a grouping variable to a matrix
     * The columns of the matrix represent the groups
     * The length of values and grp must be the same
     * @param  {Array} values  Numeric values
     * @param  {Array} grp    Grouping Variable
     * @return {Matrix}        Resulting Matrix
     */
    function grp2matrix(values, grp) {
        if (values.length !== grp.length) {
            throw new Error("grp2matrix: values array and grouping array must be the same length");
        }

        var grpIdx = grp2idx(grp);
        var nGroups = Math.max.apply(null, grpIdx) +1;
        var mat = [];
        for (var j = 0; j<nGroups; j++) { mat.push([]); }

        grpIdx.forEach(function(idx, i) {
            mat[idx].push(values[i]);
        });

        var length = mat[0].length;
        function sameLength(col) { return col.length === length; }
        if (!mat.every(sameLength)) {
            throw new Error("grp2matrix: All groups must have the same length in order to create a matrix.");
        }

        var outMat = new Matrix(mat);
        return outMat.transpose();
    }

    /**
     * A & B are 1d arrays
     * returns a 2d NdArray
     */
    function crosstab(/** 1d Arrays **/) {
        var arys = Array.prototype.slice.call(arguments, 0);

        var len = arys[0].length;

        if (!arys.every(function(A) { return A.length === len;})) {
            throw new Error("crosstab: All vectors must be the same length");
        }

        function sortN(a,b) {return a-b;}


      var sz = 1, uniques = [], idxs = [], shape = [];
        arys.forEach(function(A, i) {
            // get the size of the final crosstab table
            sz *= A.length;
            // Grab uniqe values from each array
            // Assume all arrays consist of numbers
            uniques.push(unique(A).sort(sortN));
            // get the index arrays for each array
            // ie.  where in the sorted, unique array does each element occur
            idxs.push(mapIndex(A, uniques[i]));
            shape.push(uniques[i].length);
        });


        // Create the crosstab table
      var table = new NumericNdArray(new Float32Array(sz), shape);
        // console.log("TABLE NOW:", table.print());

        var i, idx;
        // Iterate over the columns of the idxs 2d array (each column is an index)
      (new NumericNdArray(idxs)).forEach(1, function (idx, i) {
            table.plusEq(idx.toArray(), 1);
        });

        return table;

    }


  return {
    mapIndex: mapIndex,
    unique: unique,
    grp2idx: grp2idx,
    grp2matrix: grp2matrix,
    crosstab: crosstab
  };

});