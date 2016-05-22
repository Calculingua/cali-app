define([
    "../util",
    "./NdArray",
    '../typeExtend'
], function(util, NdArray, typeExtend){

    
    function range(n) {
        return Array.apply(null, Array(n)).map(function (_, i) {return i;});
    }


    var NumericNdArray = typeExtend(NdArray.prototype, {

        constructor: function(data, shape, stride, offset) {
            NdArray.call(this, data, shape, stride, offset);
        },

        /**
         * Sums each element of the array
         * @return {Number} Sum of elements
         */
        sum: function() {
            var sum = 0;
            this.forEach(function(val) {
                sum += val;
            });
            return sum;
        },

        /**
         * Normalize an array
         * @return {NdArray} New NdArray
         */
        normalize: function() {
            var mag = this.magnitude();
            var Out = new this.copy();
            Out.forEach(function(val, idx) {
                Out.set(idx, val/mag);
            });
            return Out;
        },

        /**
         * Get the magnitude of the array
         * @return {Number} Square root of the sum of squares of all elements
         */
        magnitude: function() {
            var sumSq = 0;
            this.forEach(function(val) {
                sumSq += (val*val);
            });
            return Math.sqrt(sumSq);
        },


        plusEq: function(idxs, val) {
            return (this._data[this.linIndex(idxs)] += val);
        },

        minusEq: function(idxs, val) {
            return (this._data[this.linIndex(idxs)] -= val);
        },

        /**
         * Multiply each element of the NdArray by value
         * @param  {Number} value Number to multiple each element by
         * @return {NdArray}       this object
         */
        elementTimes: function(value) {
            var self = this;
            this.forEach(function(current, idx) {
                self.set(idx, current*value);
            });
            return this;
        },



        times: function(m) {
            var r1,c1,r2,c2,prod;

            // 2d MATRIX
            if (this.shape.length === 2 && m.shape.length === 2) {
                if (this.shape[1] !== m.shape[0]) {
                    throw new Error("Dimension Error");
                }
                // TODO use strides, not indexes
                prod = [];
                for (r1=0;r1<this.shape[0];r1++) {
                    prod.push([]);
                    for (c2=0;c2<m.shape[1];c2++) {
                        prod[r1].push(0);
                        for (c1=0, r2=0 ;c1<this.shape[1];c1++, r2++) {
                            prod[r1][c2] += (this.get([r1,c1])* m.get([r2,c2]));
                        }
                    }
                }
                return new this.constructor(prod, [this.shape[0], m.shape[1]]);
            } else {
                throw new Error("Only 2d matrix multiplication supported");
            }
        },

        /**
         * Subtract an NdArray from this NdArray
         * NdArrays must have the same dimensions
         * Creates a new NdArray
         * @param {[type]} m [description]
         */
        plus: function(m, subtract) {
            subtract = !!subtract;
            if (!util.sameArray(this.shape, m.shape)) {
                throw new Error("Dimension error: Arrays must be the same dimension");
            }

            var self = this;
            var diff = new this.constructor(new Array(this.length), this.shape);
            diff.forEach(function(_, idx) {
                if (subtract) {
                    diff.set(idx, self.get(idx) - m.get(idx));
                } else {
                    diff.set(idx, self.get(idx) + m.get(idx));
                }
            });
            return diff;
        },
        minus: function(m) { return this.plus(m, true); },

        serialize: function () {
            var data = NdArray.prototype.serialize.call(this);
            data.type = "NumericNdArray";
            return data;
        },

    });



    NumericNdArray.deserialize = function (data) {
        return new NumericNdArray(data._data, data.shape, data.stride, data.offset);
    };


    return NumericNdArray;
});