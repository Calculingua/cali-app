define([
  "$J",
  "cali-calcu/mType/HandleType",
  "cali-calcu/serializeDeserialize"
], function ($J, HandleType, serializeDeserialize) {

  $J.describe("cali.calcu.mType.Handle", function () {

    $J.it("should exist in the namespace", function () {
      expect(typeof HandleType).toEqual("function");
    });

    describe("that can be initialized with a div id, view-type, and context object", function () {
      it("should store all variables", function () {
        var id = "some-long-string";
        var type = "some-type";
        var context = {some: "string", other: [1, 2, 3]};
        var xx = new HandleType(id, type, context);
        expect(xx.id).toEqual(id);
        expect(xx.viewType).toEqual(type);
        expect(xx.context).toEqual(context);
      });
    });

    describe("after initialization", function () {
      it("should have a type of `HANDLE`", function () {
        var xx = new HandleType();
        expect(xx.type).toEqual("HANDLE");
      });
    });

    describe("after cloning", function () {
      var id = "some-long-string";
      var type = "some-type";
      var context = {some: "string", other: [1, 2, 3]};
      var stringObj;
      beforeEach(function () {
        var xx = new HandleType(id, type, context);
        stringObj = serializeDeserialize.serialize(xx);
      });

      it("should have a type of `HANDLE`", function () {
        expect(stringObj.type).toEqual("HANDLE");
      });

      describe("initializes properly with the constructor", function () {
        var xx;
        beforeEach(function () {
          xx = new HandleType(stringObj);
        });

        it("should properly contain the data", function () {
          expect(xx.id).toEqual(id);
          expect(xx.viewType).toEqual(type);
          expect(xx.context).toEqual(context);
        });
      });
    });
  });

});
