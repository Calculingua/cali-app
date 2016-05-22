define([
    "$J",
    "../dev/Matchers",
    "cali-calcu/lib/Matrix",
    "cali-calcu/lib/NdArray"
], function ($J, Matchers, Matrix, NdArray) {


    $J.describe("cali.module.lib.Matrix", function () {

        $J.it("toArray() should output an array", function() {
            var m = new Matrix([1,1,1,1],[2,2]);
            console.log(m.toArray());
            console.log(m.print());
            $J.expect(m.toArray()).toEqual([[1,1],[1,1]]);
            
        });

        $J.it("should inherit from NdArray correctly", function(){
            var m = new Matrix([1,1,1,1],[2,2]);
            $J.expect(m instanceof Matrix).toEqual(true);
            $J.expect(m.constructor === Matrix).toEqual(true);
            $J.expect(Matrix.prototype.isPrototypeOf(m)).toEqual(true);
            $J.expect(NdArray.prototype.isPrototypeOf(m)).toEqual(true);
        });

        $J.it("constructor member should be set correctly", function(){
           var m = new Matrix([1,1,1,1],[2,2]);
            $J.expect(m.constructor).toEqual(Matrix);
        });

        $J.it("should not have Object as constructor", function(){
            var m = new Matrix([1,1,1,1],[2,2]);
            $J.expect(m.constructor !== Object).toEqual(true);
        });


        $J.describe("Matrix merging", function() {
            $J.beforeEach(function() {
                $J.jasmine.addMatchers(Matchers);
            });

            $J.it("should merge column vectors", function() {
                var A1 = new Matrix([1,1,1], [3,1]);
                var A2 = new Matrix([2,2,2], [3,1]);
                var A3 = new Matrix([3,3,3], [3,1]);

                var A = Matrix.mergeHorizontal([A1, A2, A3]);
                $J.expect(A.get([0,0])).toEqual(1);
                $J.expect(A.get([0,1])).toEqual(2);
                $J.expect(A.get([0,2])).toEqual(3);
                $J.expect(A.shape[0]).toEqual(3);
                $J.expect(A.shape[1]).toEqual(3);
            });
        });

        $J.it("transposes a matrix", function() {
            var m = new Matrix([[1,2],[3,4]]);
            var mt = m.transpose();
            console.log("M", m.shape, m.stride);
            console.log(m.print());
            console.log("Mtrans", mt.shape, mt.stride);
            console.log(mt.print());
            $J.expect(m.toArray()).toEqual([[1,2],[3,4]]);
            $J.expect(mt.toArray()).toEqual([[1,3],[2,4]]);
        });

        $J.describe("serialize/deserialize", function () {
            $J.it("should be able to successfully decode and encode (roundtrip)", function () {
                var m = new Matrix([[1, 2, 3, 4],[1, 2, 3, 4]]);
                var data = m.serialize();
                var mcopy = Matrix.deserialize(data);
                $J.expect(m.equals(mcopy)).toEqual(true);
            });
        });


        $J.describe("Matrix Normalization", function() {
            $J.beforeEach(function() {
                $J.jasmine.addMatchers(Matchers);
            });

            $J.it("should find the magnitude of a column vector", function() {
                var V = new Matrix([3,4],[2,1]);
                var mag = V.magnitude();
                expect(mag).toBeCloseTo(5, 4);
            });
        });


        $J.describe("Matrix QR Decomposition", function() {
            var A, Q, R, QR;

            $J.beforeEach(function() {
                $J.jasmine.addMatchers(Matchers);
            });

            $J.it("SETUP FOR TEST", function() {
                // Example taken from 
                // Steven J. Leon, "Linear Algebra with Applications" 4th edition
                // pg. 264
                A = new Matrix([[1,-2,-1],
                                [2, 0, 1],
                                [2,-4, 2],
                                [4, 0, 0]]); 
                Q = new Matrix([[1/5, -2/5, -4/5],
                                [2/5,  1/5,  2/5],
                                [2/5, -4/5,  2/5],
                                [4/5,  2/5, -1/5]]);
                R = new Matrix([[5, -2, 1],
                                [0,  4,-1],
                                [0,  0, 2]]);
                QR = A.qr();
                expect(1).toEqual(1);
            });

            $J.it("correctly calculates Q", function() {
                $J.expect(QR.Q.toArray()).toBeMatrixCloseTo(Q.toArray(), 1e-4);
            });

            $J.it("correctly calculates R", function() {
                $J.expect(QR.R.toArray()).toBeMatrixCloseTo(R.toArray(), 1e-4);
            });
        });


        $J.describe("Matrix Transformations", function() {

            $J.it("Does a basic transformation", function() {
                var M = new Matrix([[1,2],[3,4]]);
                var xMat = M.copy();
                xMat.transform(function(val) { return val+1; });
                xMat.forEach(function(val, idx) {
                    expect(val).toEqual(M.get(idx)+1);
                });
            });
        });

        $J.describe("Matrix generation", function() {
            $J.it("generates a matrix of zeros", function() {
                var m = Matrix.zeros([2,3]);
                expect(m.toArray()).toEqual([[0,0,0],[0,0,0]]);
            });
        });

    });

});