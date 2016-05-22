define([
  "$J",
  "cali-calcu/lib/chi2"
], function ($J, chi2) {

  $J.describe("CHI2 functions", function () {
    $J.describe("chi2Stat", function () {
      var chi2Stat = chi2.chi2Stat;

      $J.it("should compute x2 and return a number", function () {
        var obs = [37, 13, 17, 53];
        var exp = [22.5, 27.5, 31.5, 38.5];
        var x2 = chi2Stat(obs, exp);
        $J.expect(typeof x2).toEqual('number');
        $J.expect(x2).toBeCloseTo(29.1, 1);
      });

      $J.it("should compute x2 for an array of sets", function () {
        var obs = [
          [37, 13, 17, 53],
          [25, 25, 25, 25]
        ];
        var exp = [
          [22.5, 27.5, 31.5, 38.5],
          [64.00, 16.00, 16.00, 4.00]
        ];
        var x2 = chi2Stat(obs, exp);
        $J.expect(x2 instanceof Array).toBeTruthy();
        $J.expect(x2[0]).toBeCloseTo(29.1, 1);
        $J.expect(x2[1]).toBeCloseTo(144.14, 2);
      });
    });


    $J.describe("chi2Ind", function () {
      var chi2Ind = chi2.chi2Ind;

      $J.it("should compute x2 from a crosstab table", function () {
        var m = [
          [1, 6, 7],
          [5, 5, 2],
          [11, 7, 6]
        ];
        var x2 = chi2Ind(m);
        $J.expect(x2).toBeCloseTo(7.54, 2);
      });
    });


    $J.describe("chi2p", function () {
      var chi2p = chi2.chi2p;

      $J.it("should compute the chi2 p-value for given x2 and df", function () {

        var p = [0.995, 0.990, 0.975, 0.950, 0.900, 0.100, 0.050, 0.025, 0.010, 0.005];
        var df = [1, 2, 3, 4, 5];
        var x2 = [
          [0.00004, 0.00014, 0.001, 0.004, 0.016, 2.706, 3.841, 5.024, 6.635, 7.879],
          [0.010, 0.020, 0.051, 0.103, 0.211, 4.605, 5.991, 7.378, 9.210, 10.597],
          [0.072, 0.115, 0.216, 0.352, 0.584, 6.251, 7.815, 9.348, 11.345, 12.838],
          [0.207, 0.297, 0.484, 0.711, 1.064, 7.779, 9.488, 11.143, 13.277, 14.860],
          [0.412, 0.554, 0.831, 1.145, 1.610, 9.236, 11.070, 12.833, 15.086, 16.750]
        ];

        for (var pi = 0; pi < p.length; pi++) {
          for (var dfi = 0; dfi < df.length; dfi++) {
            $J.expect(chi2p(x2[dfi][pi], df[dfi])).toBeCloseTo(p[pi], 2);
          }
        }
      });
    });
  });

});
