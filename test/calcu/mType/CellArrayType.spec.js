define([
  "$J",
  "cali-calcu/mType/CellArrayType",
  "cali-calcu/serializeDeserialize"
], function ($J, CellArrayType, serializeDeserialize) {

  $J.describe("cali.calcu.mType.CellArray", function () {

    $J.it("should exist in the namespace", function () {
      $J.expect(typeof CellArrayType).toEqual("function");
    });

    $J.describe("that can be initialized by an array", function () {
      $J.it("should init from a flat array", function () {
        var xx = new CellArrayType([1, 2, 3]);
        $J.expect(xx[0]).toEqual(1);
        $J.expect(xx[1]).toEqual(2);
        $J.expect(xx[2]).toEqual(3);
        $J.expect(xx.type).toEqual("CELL_ARRAY");
      });

      it("should init from a nested array of numbers", function () {
        var xx = new CellArrayType([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        $J.expect(xx[0][0]).toEqual(1);
        $J.expect(xx[0][1]).toEqual(2);
        $J.expect(xx[0][2]).toEqual(3);
        $J.expect(xx[1][0]).toEqual(4);
        $J.expect(xx[1][1]).toEqual(5);
        $J.expect(xx[1][2]).toEqual(6);
      });

      it("should init from a nested array of chars", function () {
        var xx = new CellArrayType([
          ['a', 'b', 'c'],
          ['d', 'e', 'f']
        ]);
        $J.expect(xx[0][0]).toEqual('a');
        $J.expect(xx[0][1]).toEqual('b');
        $J.expect(xx[0][2]).toEqual('c');
        $J.expect(xx[1][0]).toEqual('d');
        $J.expect(xx[1][1]).toEqual('e');
        $J.expect(xx[1][2]).toEqual('f');
      });

      it("should init from a nested array of numbers", function () {
        var xx = new CellArrayType([
          [
            [1, 2, 3],
            [4, 5, 6]
          ]
        ]);
        $J.expect(xx[0][0][0]).toEqual(1);
        $J.expect(xx[0][0][1]).toEqual(2);
        $J.expect(xx[0][0][2]).toEqual(3);
        $J.expect(xx[0][1][0]).toEqual(4);
        $J.expect(xx[0][1][1]).toEqual(5);
        $J.expect(xx[0][1][2]).toEqual(6);
      });

      it("should init from a doubly nested array of chars", function () {
        var xx = new CellArrayType([
          [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
          ]
        ]);
        $J.expect(xx[0][0][0]).toEqual('a');
        $J.expect(xx[0][0][1]).toEqual('b');
        $J.expect(xx[0][0][2]).toEqual('c');
        $J.expect(xx[0][1][0]).toEqual('d');
        $J.expect(xx[0][1][1]).toEqual('e');
        $J.expect(xx[0][1][2]).toEqual('f');
      });
    });

    $J.describe("after initialization", function () {
      $J.it("should inherit from Array", function () {
        var xx = new CellArrayType();
        $J.expect(typeof xx.push).toEqual("function");
        $J.expect(typeof xx.pop).toEqual("function");
      });

      $J.it("should have a type of `CELL_ARRAY`", function () {
        var xx = new CellArrayType();
        $J.expect(xx.type).toEqual("CELL_ARRAY");
      });
    });

    $J.describe("after cloning", function () {
      var stringObj;
      $J.beforeEach(function () {
        var xx = new CellArrayType([
          [
            [1, 2],
            [4, 5]
          ],
          [
            ['a', 'b'],
            ['d', 'e']
          ]
        ]);
        stringObj = serializeDeserialize.serialize(xx);
      });

      $J.it("should have a type of `CELL_ARRAY`", function () {
        $J.expect(stringObj.type).toEqual("CELL_ARRAY");
      });

      $J.describe("initializes properly with the constructor", function () {
        var xx;
        $J.beforeEach(function () {
          xx = new CellArrayType(stringObj);
        });

        $J.it("should inherit from `Array`", function () {
          $J.expect(typeof xx.push).toEqual("function");
          $J.expect(typeof xx.pop).toEqual("function");
        });

        $J.it("should properly contain the data", function () {
          $J.expect(xx.length).toEqual(2);
          $J.expect(xx[0].length).toEqual(2);
          $J.expect(xx[1].length).toEqual(2);
          $J.expect(xx[0][0][0]).toEqual(1);
          $J.expect(xx[0][0][1]).toEqual(2);
          $J.expect(xx[0][1][0]).toEqual(4);
          $J.expect(xx[0][1][1]).toEqual(5);
          $J.expect(xx[1][0][0]).toEqual('a');
          $J.expect(xx[1][0][1]).toEqual('b');
          $J.expect(xx[1][1][0]).toEqual('d');
          $J.expect(xx[1][1][1]).toEqual('e');
        });
      });
    });
  });

});