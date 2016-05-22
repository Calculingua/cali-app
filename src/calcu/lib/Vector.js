define([
    "../util",
    './NdArray', 
    './NumericNdArray',
    './Matrix'
], function(util, NdArray, NumericNdArray, Matrix) {


    var Vector = function(data, shape, stride, offset) {


        if (!data) {throw new Error("Cannot instantiate an empty Matrix"); }
        if (shape && shape.length !== 1) { throw new Error("Vector must be 1-dimensional"); }

        if ('number' === typeof data) {
            NdArray.call(this, new Array(data));
        } else if (data instanceof Array) {
            this.shape = util.inferShape(data);
            if (this.shape.length !== 1) {
                throw new Error("Vector must be 1-dimensional");
            }
            NdArray.call(this, data);
        } else if (Vector.prototype.isPrototypeOf(data)) {
            NdArray.call(this,
                data.copyBuffer(),
                shape || data.shape,
                stride || data.stride,
                offset || data.offset
            );
        } else if (Matrix.prototype.isPrototypeOf(data)) {
            throw new Error("Cannot create a vector from a matrix...yet");
        } else if (NdArray.prototype.isPrototypeOf(data)) {
            if (data.shape.length !== 1) { throw new Error("Vector must be 1-dimensional"); }
            NdArray.call(this,
                data.copyBuffer,
                shape || data.shape,
                stride || data.stride,
                offset || data.offset
            );
        } else if (Float32Array.prototype.isPrototypeOf(data)) {
            NdArray.call(this, 
                data,
                shape || [data.length],
                stride || NdArray.inferStride(shape || [data.length]),
                offset || 0
            );
        } else {
            throw new Error("Improper Vector specification");
        }
    };

    Vector.prototype = {};
    for (var prop in NdArray.prototype) {
        if (NdArray.prototype.hasOwnProperty(prop) && ! Vector.prototype.hasOwnProperty(prop)) {
            Vector.prototype[prop] = NdArray.prototype[prop];
        }
    }



    // ==== DOT PRODUCT ========================================================
    Vector.prototype.dot = function(v) {
        if ('number' === typeof v) { return this.dotScalar(v); }
        if (Vector.prototype.isPrototypeOf(v)) { return this.dotVector(v); }
        if (Matrix.prototype.isPrototypeOf(v)) { return this.dotMatrix;}
    };

    Vector.prototype.dotScalar = function(n) {
        var v = this.copy();
        v.forEach(function(val, idx) {
            v.set(idx, val*n);
        });
        return v;
    };

    Vector.prototype.dotVector = function(v) {
        if (this.length !== v.length) {
            throw new Error("Dimension mismatch in Vector dot product");
        }
        var out = 0;
        for (var i=0; i<this.length; i++) {
            out += this.get([i]) * v.get([i]);
        }
        return out;
    };

    Vector.prototype.dotMatrix = function(m) {
        // if (this.length !== m.shape[0]) {
        //     throw new Error("Dimension mismatch in Vector/Matrix multiplication");
        // }
        // var i;
        // var out = new Vector(m.shape[1])
        // m.forEach(1, function(col, idx) {
        //     for (i=0;)
        // })
    };
   
   return Vector; 
});
