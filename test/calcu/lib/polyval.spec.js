define([
  "$J",
  "cali-calcu/lib/polyval"
], function ($J, polyval) {

  $J.describe("cal.module.lib.polyval", function () {


    $J.it("polyval for order 1 should evaluate correctly (1)", function () {
      //2p^1 + 1p^0 = 3
      $J.expect(polyval.polyval([2, 1], 1)).toEqual(3);
    });

    $J.it("polyval for order 1 should evaluate correctly (2)", function () {
      //2*4^1 + 1*4^0 = 9
      $J.expect(polyval.polyval([2, 1], 4)).toEqual(9);
    });

    $J.it("test for order 2", function () {
      $J.expect(polyval.polyval([10, 0, 12], 1)).toEqual(22);
    });

    $J.it("array version has different return type", function () {
      $J.expect(polyval.polyvalMulti([2, 1], [4, 1])).toEqual([9, 3]);
    });

  });

});