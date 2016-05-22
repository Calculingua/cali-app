define([
  "$J",
  "cali-calcu/lib/hist"
], function ($J, hist) {

  $J.describe("cali.module.lib.hist", function () {

    $J.describe("histInBins", function () {
      $J.it("single bin should be a simple count", function () {
        var counts = hist.histInBins([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [2]);
        $J.expect(counts).toEqual([10]);
      });

      $J.it("should divide with the values as centers", function () {
        var result = hist.histInBins([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 6]);
        $J.expect(result.counts).toEqual([2, 8]);
        $J.expect(result.centers).toEqual([0, 6]);
        $J.expect(result.binWidth).toEqual(6);
        $J.expect(result.starts).toEqual([-3, 3]);
      });

      $J.it("should collect everything in the lower bin", function () {
        var result = hist.histInBins([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [100, 200]);
        $J.expect(result.counts).toEqual([10, 0]);
        $J.expect(result.centers).toEqual([100, 200]);
        $J.expect(result.binWidth).toEqual(100);
        $J.expect(result.starts).toEqual([1, 150]);
      });

      $J.it("check jumble", function () {
        var result = hist.histInBins([112, 82, 67, 18, 12, 32, 11, 19, 0, 100], [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
        $J.expect(result.counts).toEqual([ 3, 2, 1, 0, 0, 0, 1, 1, 0, 2 ]);
        $J.expect(result.centers).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
        $J.expect(result.binWidth).toEqual(10);
        $J.expect(result.starts).toEqual([0, 15, 25, 35, 45, 55, 65, 75, 85, 95]);
      });

    });
  });
});