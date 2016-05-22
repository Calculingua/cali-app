define([
  "cali-calcu/mType/Categorical",
  "cali-calcu/serializeDeserialize",
  "$J"
], function (Categorical, serializeDeserialize, $J) {

  $J.describe("cali.calcu.mType.Categorical", function () {


    it("should exist in the namespace", function () {
      expect(typeof Categorical).toEqual("function");
    });

    describe("after initialization", function () {
      it("should have a type of `CATEGORICAL`", function () {
        var xx = new Categorical();
        expect(xx.type).toEqual("CATEGORICAL");
      });
    });

    describe("after cloning", function () {
      var obj = {data: [
        [1, 2, 1, 2],
        [2, 1, 2, 1]
      ], properties: {values: [1, 2], names: ["butts", "heads"]}};
      var stringObj;
      beforeEach(function () {
        var xx = new Categorical(obj);
        stringObj = serializeDeserialize.serialize(xx);
      });

      it("should have a type of `CATEGORICAL`", function () {
        expect(stringObj.type).toEqual("CATEGORICAL");
      });

      describe("initializes properly with the constructor", function () {
        var xx;
        beforeEach(function () {
          xx = new Categorical(stringObj);
        });

        it("should properly contain the data", function () {
          expect(xx.data).toEqual(obj.data);
          expect(xx.properties).toEqual(obj.properties);
        });
      });
    });
  });

});
