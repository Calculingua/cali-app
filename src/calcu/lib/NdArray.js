define([
    "../util"
], function(util){



    // new IndexCursor(shape, [dim1, null, null]);
    // new IndexCursor(shape, [{start:n1, stop:n2}, null, null]);
    function IndexCursor(shape, indexRange) {
        var i, range;
        if (!indexRange) {
            indexRange = [];
            for (i=0; i<shape.length; i++) {
                indexRange.push(null);
            }
        }

        if (shape.length !== indexRange.length) {
            throw new Error("IndexCursor: shape and indexRange array must be same length");
        }

        this.ranges = [];
        this.pointer = null;
        this.diff = null;
        // Reverse = true means move from dim=0 up
        // Reverse = false means move from dim=last down
        this.reverse = false;   


        for (i=0; i<indexRange.length; i++) {
            range = indexRange[i];
            if (range === null || range === undefined) {
                this.ranges.push({start: 0, end: shape[i]});
            } else if ('number' === typeof range) {
                this.ranges.push({start: range, end: range});
            } else if ('object' === typeof range && !!range.start && !!range.end) {
                this.ranges.push(range);
            } else {
                throw new Error("IndexCursor: Improper instantiation: " + range.toString());
            }

        }
        this.reset();
    }

    IndexCursor.prototype.next = function() {
        var carryOver = true;
        var previousPointer;
        var idx = (this.reverse) ? 0 : this.ranges.length - 1;


        if (this.pointer === null) {
            this.pointer = this.ranges.map(function(rng) { return rng.start; });
            this.diff = this.ranges.map(function (rng) {
                return 0;
            });
        } else {
            previousPointer = this.pointer.slice(0);
            while (carryOver) {
                if (idx>=this.ranges.length || idx < 0) {
                    return null;
                }

                this.pointer[idx] += 1;
                if (this.pointer[idx] >= this.ranges[idx].end) {
                    this.pointer[idx] = this.ranges[idx].start;
                    idx += (this.reverse) ? 1 : -1;
                } else {
                    carryOver = false;
                }
            }
            this.diff = this.pointer.map(function(point, i) { return point - previousPointer[i]; });
        }

        return this.pointer.slice(0);
    };

    IndexCursor.prototype.nextDiff = function () {
        this.next();
        return this.diff;
    };

    IndexCursor.prototype.reset = function(lastDimFirst) {
        this.reverse = !!lastDimFirst;
        this.pointer = null;
        this.diff = null;
    };

    function sameDimension(dim, ary) {
        if (dim.length === 1) {
            return ary.length === dim[0];
        } else {
            return sameDimension(dim.slice(1), ary[0]);
        }
    }


    function sameArrayBuffer(buf1, buf2) {
        if (buf1.byteLength != buf2.byteLength) return false;
        var dv1 = new Int8Array(buf1);
        var dv2 = new Int8Array(buf2);
        for (var i = 0 ; i != buf1.byteLength ; i++)
        {
            if (dv1[i] != dv2[i]) return false;
        }
        return true;
    }

    function range(n) {
        return Array.apply(null, Array(n)).map(function (_, i) {return i;});
    }


    function NdArray(data, shape, stride, offset) {

        if (!data) {
            throw new Error("Cannot instantiate an empty array");
        }

        // If we are passed an NdArray, the original and new NdArray will 
        // operate on the same data.  CAUTION
        // To make a copy of the original data, use NdArray.copy();
        if (data instanceof NdArray) {
            this._data = data._data;
            this.shape = shape || data.shape.slice(0);
            this.stride = stride || data.stride.slice(0);
            this.offset = offset || data.offset;
        } else if (data instanceof Array) {
            this.shape = shape || util.inferShape(data);
            this._data = NdArray.flattenArray(data, this.shape);
            this.stride = stride || NdArray.inferStride(this.shape);
            this.offset = offset || 0;
        } else if ("[object Float32Array]" === data.toString()) {
            this._data = data;
            this.shape = shape || [data.length];
            this.stride = stride || NdArray.inferStride(this.shape);
            this.offset = offset || 0;
        } else {
            throw new Error("Improper Array specification");
        }

        this.length = this.shape.reduce(function(prev, cur) {
            return prev*cur;
        },1);

    }

    /**
     * Copy the present NdArray
     * Makes a shallow copy of the _data property so that the original
     * and new NdArrays operate on different objects
     * @return {[type]} [description]
     */
    NdArray.prototype.copy = function() {
        var data, buffer;

        if (this._data instanceof Array) {
            data = this._data.slice(0);
        } else {
            buffer = new ArrayBuffer(this._data.byteLength);
            data = new Float32Array(buffer);
            data.set(this._data);
        }
        return new this.constructor(data, this.shape, this.stride, this.offset);
    };

    /**
     * Create a new NdArray that uses the same data as this one
     * @return {[type]}        [description]
     */
    NdArray.prototype.clone = function(shape, stride, offset) {
        shape = shape || this.shape;
        stride = stride || this.stride;
        offset = offset || this.offset;
        var nda = new this.constructor(this._data, shape, stride, offset);
        nda._data = this._data;
        nda.length = nda.shape.reduce(function(prev, cur) {
            return prev*cur;
        },1);
        return nda;
    };

    /**
     * Converts a multi-dimensional index to a linear index
     * The linear index is used to access data on the _data property
     * The linear index takes in to consideration NdArray properties like
     * `offset`, `shape`, and `stride`
     * @param  {Array} idxs Multi-dimensional index
     * @return {Number}      Linear index
     */
    NdArray.prototype.linIndex = function(idxs) {
        var idx = this.offset;
        if (idxs.length !== this.shape.length) {
            throw new Error("NdArray: Index Error");
        }
        for (var i=0;i<this.stride.length;i++) {
            idx += this.stride[i]*idxs[i];
        }
        return idx;
    };


    /**
     * GET a data value
     * @param {Array or Number} idxs Either an array representing a multi-dimensional
     *                               index, or a list of function parameters representing
     *                               a multi-dimensional index. 
     * @return {Various} Value stored at the index provided
     *
     * @example
     * val = m.get([indexes])
     * val = m.get(indexes)
     */
    NdArray.prototype.get = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var idxs;
        if (args[0] instanceof Array) {
            idxs = args[0];
        } else {
            idxs = args;
        }
        return this._data[this.linIndex(idxs)];
    };

    /**
     * SET a data value
     * @param {Array or Number} idxs Either an array representing a multi-dimensional
     *                               index, or a list of function parameters representing
     *                               a multi-dimensional index. 
     * @param {Various} val Value to set at the index provided
     * @return {Various} Value stored at the index provided
     *
     * @example
     * m.set([indexes], val)
     * m.set(indexes, val)
     */
    NdArray.prototype.set = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var val = args.pop();
        var idxs;
        if (args[0] instanceof Array) {
            idxs = args[0];
        } else {
            idxs = args;
        }
        var idx = this.linIndex(idxs);
        return (this._data[idx] = val);

    };


    // iterator callback is of the form
    //  iterator(value, [index], n)
    //  stopIterator - takes the return value of iterator.  If returns true,
    //      stop the iteration, otherwise continue;
    NdArray.prototype.forEach = function(dim, iterator) {
        var cursor;
        var self = this;
        var idx, i;
        if ('function' === typeof dim) {
            iterator = dim;
            dim = null;
        }


        if ('number' !== typeof dim) {
            cursor = new IndexCursor(this.shape);
            i = 0;
            while((idx=cursor.next())) {
                iterator(self.get(idx), idx, i);
                i++;
            }
        } else {

            if (dim <0 || dim >= this.shape.length) {
                throw new Error("Dimension Error: cannot iterate over non-existant dimension, " + dim);
            }

            var slice = new Array(this.shape.length);
            for (i=0; i<this.shape[dim]; i++) {
                slice[dim] = i;
                iterator(this.slice(slice), i);
            }
        }
    };

    NdArray.prototype.every = function(iterator) {
        var cursor = new IndexCursor(this.shape);
        var idx, i=0;
        var ret;
        idx = cursor.next();
        while (idx) {
            ret = iterator(this.get(idx), idx, i++);
            if (!ret) { return false; }
            idx = cursor.next();
        }
        return true;
    };

    /**
     * Apply a function, in place, to each element of the NdArray
     * @param  {Function} fn callback that takes a numeric value and returns a number
     * @return {NdArray}      This NdArray
     */
    NdArray.prototype.transform = function(fn) {
        var self = this;
        this.forEach(function(val, idx) {
            self.set(idx, fn(val));
        });
        return this;
    };


    /**
     * lo and hi are 0-based index arrays
     */
    NdArray.prototype.sub = function(lo, hi) {
        if (!hi || !(hi instanceof Array)) {
            return; // TODO do this later
        }
        if (!lo || !(lo instanceof Array)) {
            return; // TODO do this later
        }
        var stride = this.stride.slice(0);
        var shape;
        var offset = this.offset;
        var i, idx;

        // hi
        shape = hi.map(function(idx, i) {
            return ('number' !== typeof idx || idx < 0) ? this.shape[i] : (idx|0) + 1;
        });

        // lo
        for (i=0;i<this.shape.length;i++) {
            if ('number' === typeof lo[i]) {
                idx = lo[i]|0;  // fast floor
                offset += stride[i]*idx;
                shape[i] -= idx;
            }
        }
        return new this.constructor(this._data, shape, stride, offset);
    };

    // sl = m.slice([indices])
    // sl = m.slice([dimension, index])
    // Returns an NdArray with one fewer dimension
    NdArray.prototype.slice = function() {
        var args = Array.prototype.slice.call(arguments,0);
        var idxs;
        if (args[0] instanceof Array) {
            if (args[0].length !== this.shape.length) {
                throw new Error("Dimension Error");
            }
            idxs = args[0];
        } else {
            // args[0] is the dimension
            // args[1] is the index
            if (args[0] < 0 || args[0]>= this.shape.length) {
                throw new Error("Cannot slice non-existant dimension, " + args[0]);
            }
            idxs = new Array(this.shape.length);
            idxs[args[0]] = args[1];
        }



        var offset = this.offset;
        var stride = [];
        var shape = [];
        for (var i=0; i<this.shape.length; i++) {
            if ('number' === typeof idxs[i] && idxs[i] >= 0) {
                offset += (idxs[i]*this.stride[i]);
            } else {
                stride.push(this.stride[i]);
                shape.push(this.shape[i]);
            }
        }
        var newSlice = this.clone(shape, stride, offset);
        return newSlice;
    };

    NdArray.prototype.serialize = function () {
        return {
            type: "NdArray",
            _data: Array.prototype.slice.call(this._data),
            offset: this.offset,
            shape: this.shape.slice(),
            stride: this.stride.slice()
        };
    };


    NdArray.prototype.equals = function(m) {
        if (!this.sameShape(m)) { return false; }
        if (!m.get) { return false; }
        return this.every(function(val, idx) {
            return val === m.get(idx);
        });
    };

    NdArray.prototype.sameShape = function(m) {
        if (this.shape.length !== m.shape.length) { return false; }
        for (var i=0;i<this.shape.length;i++) {
            if (this.shape[i] !== m.shape[i]) {return false;}
        }
        return true;
    };



    NdArray.prototype.toArray = function() {
        var shape = this.shape.slice(0);
        var source, collection = [], working = [];

        var step = shape.pop();


        this.forEach(function(val, idx, i) {
            working.push(val);
            if ((i+1) % step === 0) {
                collection.push(working);
                working = [];
            }
        });

        // Now that the NdArray is completely in an array treat the
        // remaining dimensions differently
        while (shape.length > 0) {
            step = shape.pop();
            source = collection;
            collection = [];
            for (var i = 0; i < source.length; i += 1) {
                working.push(source[i]);
                if ((i+1) % step === 0) {
                    collection.push(working);
                    working = [];
                }
            }
        }

        return collection[0];

    };

    NdArray.prototype.copyDataToArray = function (destinationArray) {
        for (var i = 0; i < this._data.length; i += 1) {
            destinationArray[i] = this._data[i];
        }
    };

    NdArray.prototype.print = function() {return NdArray.prettyPrint(this.toArray()); };
    NdArray.prototype.log = function() { console.log(this.print()); };


    NdArray.inferStride = function(shape) {
        var stride = [1];
        var rshp = shape.slice(1).reverse();
        rshp.reduce(function(p,c) {
            stride.unshift((p*=c));
            return p;
        },1);
        return stride;
    };

    NdArray.flattenArray = function(ary, shape) {
        if (!shape) {shape = util.inferShape(ary); }

        var a = ary.slice(0);
        var merged;
        for (var i=1; i< shape.length; i++) {
            merged = [];
            a = merged.concat.apply(merged, a);
        }
        return a;
    };

    NdArray.deserialize = function (data) {
        return new NdArray(data._data, data.shape, data.stride, data.offset);
    };

    /**
     * Adapted from Numeric.prettyPrint
     * https://github.com/sloisel/numeric/blob/master/src/numeric.js#L38
     */
    NdArray.prettyPrint = function prettyPrint(x) {
        var precision = 5;
        var largeArray = 50;

        function fmtnum(x) {
            if(x === 0) { return '0'; }
            if(isNaN(x)) { return 'NaN'; }
            if(x<0) { return '-'+fmtnum(-x); }
            if(isFinite(x)) {
                var scale = Math.floor(Math.log(x) / Math.log(10));
                var normalized = x / Math.pow(10,scale);
                var basic = normalized.toPrecision(precision);
                if(parseFloat(basic) === 10) { scale++; normalized = 1; basic = normalized.toPrecision(precision); }
                return parseFloat(basic).toString()+'e'+scale.toString();
            }
            return 'Infinity';
        }
        var ret = [];
        function foo(x) {
            var flag;
            var k;
            if(typeof x === "undefined") { ret.push(Array(precision+8).join(' ')); return false; }
            if(typeof x === "string") { ret.push('"'+x+'"'); return false; }
            if(typeof x === "boolean") { ret.push(x.toString()); return false; }
            if(typeof x === "number") {
                var a = fmtnum(x);
                var b = x.toPrecision(precision);
                var c = parseFloat(x.toString()).toString();
                var d = [a,b,c,parseFloat(b).toString(),parseFloat(c).toString()];
                for(k=1;k<d.length;k++) { if(d[k].length < a.length) a = d[k]; }
                ret.push(Array(precision+8-a.length).join(' ')+a);
                return false;
            }
            if(x === null) { ret.push("null"); return false; }
            if (typeof x === "function") {
                ret.push(x.toString());
                flag = false;
                for (k in x) {
                    if (x.hasOwnProperty(k)) {
                    if(flag) ret.push(',\n');
                    else ret.push('\n{');
                        flag = true;
                        ret.push(k);
                        ret.push(': \n');
                        foo(x[k]);
                } }
                if(flag) ret.push('}\n');
                return true;
            }
            if(x instanceof Array) {
                if(x.length > largeArray) { ret.push('...Large Array...'); return true; }
                flag = false;
                ret.push('[');
                for(k=0;k<x.length;k++) { if(k>0) { ret.push(','); if(flag) ret.push('\n '); } flag = foo(x[k]); }
                ret.push(']');
                return true;
            }
            ret.push('{');
            flag = false;
            for(k in x) { if(x.hasOwnProperty(k)) { if(flag) ret.push(',\n'); flag = true; ret.push(k); ret.push(': \n'); foo(x[k]); } }
            ret.push('}');
            return true;
        }
        foo(x);
        return ret.join('');
    };

    NdArray.IndexCursor = IndexCursor;


    return NdArray;
});