define([], function () {

    function getDim(a) {
        if (!(a instanceof Array)) {
            return 0;
        }
        if (a[0] instanceof Array) {
            return [a.length].concat(getDim(a[0]));
        } else {
            return [a.length];
        }
    }

    function inferShape(ary) {
        return getDim(ary);
    }

    return {

        // =============================================================================
        // ==== STATIC METHODS =========================================================
        // =============================================================================
        /**
         * Determines the shape of a nested array
         * @param  {Array} ary Regular nested array
         * @return {Array}     Shape array
         */
        inferShape: inferShape,

        firstNonSingletonDimension: function (matrix2d) {
            var shape = inferShape(matrix2d);

            if (typeof shape[1] === "number" && shape[1] > 1) {
                return matrix2d[0];
            }

            var firstDimension;
            if (shape[0] > 1) {
                firstDimension = new Array(shape[0]);
                for (var i = 0; i < shape[0]; i += 1) {
                    firstDimension[i] = matrix2d[i][0];
                }
                return firstDimension;
            }

        },

        sameArray: function sameArray(a1, a2) {
            // if the other array is a falsy value, return
            if (!a1 || !a2) {
                return false;
            }

            // compare lengths - can save a lot of time
            if (a1.length != a2.length) {
                return false;
            }

            for (var i = 0, l = a1.length; i < l; i++) {
                // Check if we have nested arrays
                if (a1[i] instanceof Array && a2[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!sameArray(a1[i], a2[i])) {
                        return false;
                    }
                } else if (a1[i] != a2[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        }
    };

});