define([
  "$J",
  "cali-calcu/lib/range"
], function ($J, range) {

  $J.describe("cali.module.lib.range", function () {

    $J.it("should create an array of numbers via range(n)", function () {
      var r = range(5);
      expect(r).toEqual([0, 1, 2, 3, 4]);
    });

    $J.it("should create an array of numbers via range(start, n)", function () {
      var r = range(4, 5);
      expect(r).toEqual([4, 5, 6, 7, 8]);
      expect(range(1.2, 5)).toEqual([1.2, 2.2, 3.2, 4.2, 5.2]);
    });

    $J.it("should create an array of numbers via range(start, n, step)", function () {
      expect(range(1, 4, 2)).toEqual([1, 3, 5, 7]);
    });

  });

});