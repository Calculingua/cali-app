define([
    "../util",
    "../typeExtend",
    './NdArray',
    './NumericNdArray',
    './Vector',
    'numeric'
], function (util, typeExtend, NdArray, NumericNdArray, Vector, numeric) {


    var Matrix = typeExtend(NumericNdArray.prototype, {

        constructor: function Matrix(data, shape, stride, offset) {

            if (!data) {
                throw new Error("Cannot instantiate an empty Matrix");
            }
            if (shape && shape.length !== 2) {
                throw new Error("Matrix must be 2-dimensional");
            }


            if (data instanceof Matrix) {
                NdArray.call(this,
                    data.bufferCopy(),
                        shape || data.shape,
                        stride || data.stride,
                        offset || data.offset
                );
            } else if (data instanceof Array) {
                shape = shape || util.inferShape(data);
                if (shape.length !== 2) {
                    throw new Error("Matrix must be two dimensional");
                }
                NdArray.call(this, 
                    data, 
                    shape, 
                    stride || NdArray.inferStride(shape || [data.length]),
                    offset || 0);
            } else if (data instanceof NdArray) {
                shape = shape || data.shape;
                if (shape.length !== 2) {
                    throw new Error("Matrix must be two dimensional");
                }
                NdArray.call(this,
                    data._data,
                    shape,
                        stride || data.stride,
                        offset || data.offset
                );
            } else if ("[object Float32Array]" === data.toString()) {
                NdArray.call(this,
                    data,
                        shape || [data.length],
                        stride || NdArray.inferStride(shape || [data.length]),
                        offset || 0
                );
            } else {
                throw new Error("Improper Matrix specification");
            }

        },

        isRowVector: function() { return this.shape[0] === 1; },
        isColumnVector: function() { return this.shape[1] === 1; },

        transpose: function () {
            // make a shallow copy, then swap the strides
            var newStride = this.stride.slice(0);
            var newShape = this.shape.slice(0);
            newStride.unshift(newStride.pop());
            newShape.unshift(newShape.pop());
            return new Matrix(this._data, newShape, newStride, this.offset);
        },

        /**
         * Create a diagonal matrix from a row or column Matrix
         * @return {Matrix} [description]
         */
        diag: function() {
            if (!this.isRowVector() && !this.isColumnVector()) {
                throw new Error("Can only create diagonal matrix from row- or column vectors");
            }
            var size = this.length;
            var diag = Matrix.zeros([size, size]);

            function getRowV(i) { return this.get([0,i]); }
            function getColV(i) { return this.get([i,0]); }
            var getV = (this.isRowVector()) ? getRowV.bind(this) : getColV.bind(this);

            for (var i=0; i<size; i++) {
                diag.set([i,i], getV(i));
            }
            return diag;
        },

        inverse: function () {
            return new Matrix(numeric.inv(this.toArray()));
        },
        /**
         * Multiply the matrix
         * Dispatches to one of
         *     matrix.timesMatrix
         *     matrix.timesVector
         *     matrix.timesScalar
         * @param  {NdArray or Number} mvs Matrix, Vector or Scalar
         * @return {Matrix or Vector}     Product of matrix and object
         */
        times: function (mvs) {
            if (Matrix.prototype.isPrototypeOf(mvs) || (mvs instanceof NdArray && mvs.shape.length === 2)) {
                return this.timesMatrix(mvs);
            } else if (Vector.prototype.isPrototypeOf(mvs)) {
                return this.timesVector(mvs);
            } else if (mvs instanceof NdArray && mvs.shape.length === 1) {
                return this.timesVector(mvs);
            } else if ('number' === typeof mvs) {
                return this.timesScalar(mvs);
            }
        },
        timesMatrix: function (m) {
            var r1, c1, r2, c2, prod;

            if (this.shape[1] !== m.shape[0]) {
                throw new Error("Dimension Error");
            }
            // TODO use strides, not indexes
            prod = [];
            for (r1 = 0; r1 < this.shape[0]; r1++) {
                prod.push([]);
                for (c2 = 0; c2 < m.shape[1]; c2++) {
                    prod[r1].push(0);
                    for (c1 = 0, r2 = 0; c1 < this.shape[1]; c1++, r2++) {
                        prod[r1][c2] += (this.get([r1, c1]) * m.get([r2, c2]));
                    }
                }
            }
            return new Matrix(prod, [this.shape[0], m.shape[1]]);

        },
        timesVector: function (v) {
            if (this.shape[1] !== v.length) {
                throw new Error("Dimension mismatch between Matrix and Vector");
            }

            var newv = [];
            this.forEach(0, function (row, idx) {
                var sum = 0;
                row.forEach(function (val, idx) {
                    sum += val * v.get(idx);
                });
                newv.push(sum);
            });
            return new Vector(newv);
        },
        timesScalar: function (s) {
            var newMat = this.copy();
            newMat.forEach(function (val, idx) {
                newMat.set(idx, val * s);
            });
            return newMat;
        },
        
        rows: function(r) {
            if (r) {
                return this.sub([r,0], [r,this.shape[1]-1]);
            } else {
                var rows = [];
                for (var i=0; i< this.shape[0];i++) {
                    rows.push(this.sub([i,0], [i,this.shape[1]-1]));
                }
                return rows;
            }
        },
        cols: function(c) {
            if (c) {
                return this.sub([0,c], [this.shape[0]-1, c]);
            } else {
                var cols = [];
                for (var i=0; i< this.shape[1];i++) {
                    cols.push(this.sub([0,i], [this.shape[0]-1, i]));
                }
                return cols;
            }
        },

        serialize: function () {
            var data = NdArray.prototype.serialize.call(this);
            data.type = "Matrix";
            return data;
        },

        /**
         * QR Decomposition of Matrix
         * Method follows the Gram-Schmidt process
         * @return {Object} Objects containing 'q' and 'r' properties
         */
        qr: function () {
            var cols = this.shape[1];


            var A = this.cols();
            var Q = [];
            var R = Matrix.zeros([cols, cols]);
            var mag;

            for (var k=0; k< this.shape[1]; k++) {
                Q.push(A[k].copy());
                mag = R.set([k,k], Q[k].magnitude());
                Q[k].elementTimes(1/mag);
                
                for (var j=k+1; j<this.shape[1]; j++) {
                    var rkj = Q[k].transpose().times(A[j]).get([0,0]);
                    R.set([k,j], rkj);
                    A[j] = A[j].minus(Q[k].copy().elementTimes(rkj));
                }
            }

            return {
                Q: Matrix.mergeHorizontal(Q),
                R: R
            };
        },
    });



    /**
     * Create a matrix prefilled with a value
     * @param  {Number} Value to fill the matrix with
     * @param  {Array} shape 2-element array defining the shape of the Matrix
     * @return {Matrix}       Matrix of shape `shape` with each element set to zero
     */
    Matrix.fill = function (value, shape) {
        if (shape.length !== 2) {
            throw new Error("Dimension error: must be a 2-d matrix");
        }
        var msize = shape[0] * shape[1];
        var M = new Matrix(new Array(msize), shape);
        for (var i = 0; i < msize; i++) {
            M._data[i] = value;
        }
        return M;
    };
    Matrix.zeros = function (shape) {
        return Matrix.fill(0, shape);
    };
    Matrix.ones = function (shape) {
        return Matrix.fill(1, shape);
    };

    /**
     * Joins matrices and arrays in to a new Matrix
     * @return {[type]} [description]
     */
    Matrix.mergeHorizontal = function (arrayOfMatrices) {
        // Determine the final shape of the output Matrix
        var newShape = arrayOfMatrices.reduce(function (shape, m) {
            shape[0] = Math.max(shape[0], m.shape[0]);
            shape[1] += m.shape[1];
            return shape;
        }, [0, 0]);

        var newSize = newShape[0] * newShape[1];
        var merged = Matrix.zeros(newShape);

        var iMat = 0;
        var iMatCol = 0;
        var iMatRow = 0;
        for (var col = 0; col < newShape[1]; col++, iMatCol++) {
            if (iMatCol >= arrayOfMatrices[iMat].shape[1]) {
                iMat++;
                iMatCol = 0;
            }

            for(iMatRow=0; iMatRow<arrayOfMatrices[iMat].shape[0]; iMatRow++) {
                merged.set([iMatRow, col], arrayOfMatrices[iMat].get([iMatRow, iMatCol]));
            }
        }

        return merged;

    };

    Matrix.deserialize = function (data) {
        return new Matrix(data._data, data.shape, data.stride, data.offset);
    };

    return Matrix;

});