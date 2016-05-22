define([
  "$J",
  "cali-calcu/mType/TableType",
  "cali-calcu/serializeDeserialize"
], function ($J, TableType, serializeDeserialize) {


  $J.describe("cali.calcu.mType.Table", function () {

    var obj = {
      data: [
        [
          [1],
          [2],
          [3]
        ],
        [
          [4],
          [5],
          [6]
        ]
      ],
      properties: {
        VariableNames: [ "butts", "heads"],
        RowNames: ["one", "two", "three"]
      }
    };

    it("should exist in the namespace", function () {
      expect(typeof TableType).toEqual("function");
    });

    describe("when initialized with a single object", function () {
      it("should store all variables", function () {

        var xx = new TableType(obj);
        expect(xx.data).toEqual(obj.data);
        expect(xx.properties.VariableNames).toEqual(obj.properties.VariableNames);
        expect(xx.properties.RowNames).toEqual(obj.properties.RowNames);
        expect(xx.properties.DimensionNames).toEqual([]);
        expect(xx.properties.Description).toEqual("");
        expect(xx.properties.VariableDescriptions).toEqual([]);
        expect(xx.properties.VariableUnits).toEqual([]);
        expect(xx.properties.UserData).toEqual(null);
      });
    });

    describe("after initialization", function () {
      it("should have a type of `TABLE`", function () {
        var xx = new TableType();
        expect(xx.type).toEqual("TABLE");
      });
    });

    describe("after cloning", function () {
      var clonedObj;
      beforeEach(function () {
        var xx = new TableType(obj);
        clonedObj = serializeDeserialize.serialize(xx);
      });

      it("should have a type of `TABLE`", function () {
        expect(clonedObj.type).toEqual("TABLE");
      });

      it("should properly initialize a Table with the constructor", function () {
        var xx = new TableType(clonedObj);
        expect(xx.data).toEqual(obj.data);
        expect(xx.properties.VariableNames).toEqual(obj.properties.VariableNames);
        expect(xx.properties.RowNames).toEqual(obj.properties.RowNames);
        expect(xx.properties.DimensionNames).toEqual([]);
        expect(xx.properties.Description).toEqual("");
        expect(xx.properties.VariableDescriptions).toEqual([]);
        expect(xx.properties.VariableUnits).toEqual([]);
        expect(xx.properties.UserData).toEqual(null);
      })
    });
  });

});
