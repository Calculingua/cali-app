define([
  "$J",
  "cali-calcu/mType/MatrixType",
  "cali-calcu/serializeDeserialize"
], function ($J, MatrixType, serializeDeserialize) {


  $J.describe("cali.calcu.mType.Matrix", function () {


    $J.it("should exist in the namespace", function () {
      $J.expect(typeof MatrixType).toEqual("function");
    });

    describe("that can be initialized by an array", function () {

      it("should init from a nested array of numbers", function () {
        var xx = new MatrixType([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        expect(xx[0][0]).toEqual(1);
        expect(xx[0][1]).toEqual(2);
        expect(xx[0][2]).toEqual(3);
        expect(xx[1][0]).toEqual(4);
        expect(xx[1][1]).toEqual(5);
        expect(xx[1][2]).toEqual(6);
      });
    });

    describe("after initialization", function () {
      it("should inherit from Array", function () {
        var xx = new MatrixType();
        expect(typeof xx.push).toEqual("function");
        expect(typeof xx.pop).toEqual("function");
      });

      it("should have a type of `MATRIX`", function () {
        var xx = new MatrixType();
        expect(xx.type).toEqual("MATRIX");
      });
    });

    describe("after cloning", function () {
      var stringObj;
      beforeEach(function () {
        var xx = new MatrixType([
          [1, 2],
          [4, 5]
        ]);
        stringObj = serializeDeserialize.serialize(xx);
      });

      it("should have a type of `MATRIX`", function () {
        expect(stringObj.type).toEqual("MATRIX");
      });

      describe("initializes properly with the constructor", function () {
        var xx;
        beforeEach(function () {
          xx = new MatrixType(stringObj);
        });

        it("should inherit from `Array`", function () {
          expect(typeof xx.push).toEqual("function");
          expect(typeof xx.pop).toEqual("function");
        });

        it("should properly contain the data", function () {
          expect(xx[0]).toEqual([1, 2]);
          expect(xx[1]).toEqual([4, 5]);
        });
      });
    });
  });

});
