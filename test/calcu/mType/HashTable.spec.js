define([
  "$J",
  "cali-calcu/mType/HashTable",
  "cali-calcu/serializeDeserialize"
], function ($J, HashTable, serializeDeserialize) {


  $J.describe("cali.calcu.mType.HashTable", function () {

    it("should exist in the namespace", function () {
      expect(typeof HashTable).toEqual("function");
    });

    describe("after initialization", function () {
      it("should have a type of `HASH_TABLE`", function () {
        var xx = new HashTable();
        expect(xx.type).toEqual("HASH_TABLE");
      });
    });

    describe("after cloning", function () {
      var obj = {some: "string", other: [1, 2, 3]};
      var stringObj;
      beforeEach(function () {
        var xx = new HashTable(obj);
        stringObj = serializeDeserialize.serialize(xx);
      });

      it("should have a type of `HASH_TABLE`", function () {
        expect(stringObj.type).toEqual("HASH_TABLE");
      });

      describe("initializes properly with the constructor", function () {
        var xx;
        beforeEach(function () {
          xx = new HashTable(stringObj);
        });

        it("should properly contain the data", function () {
          expect(xx.data.some).toEqual(obj.some);
          expect(xx.data.other).toEqual(obj.other);
        });
      });
    });
  });

});
