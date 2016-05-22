define([
  "$J",
  "cali-calcu/lib/anova",
  "cali-calcu/lib/Matrix"
], function ($J, anova, Matrix) {

    $J.describe("ANOVA methods", function () {
        $J.describe("1-way ANOVA methods", function() {
            $J.describe("balanced 1-way ANOVA method", function() {
                var anova1 = anova.anova1;
                var anovaObj = {};

                $J.it("should do a 1-way balanced ANOVA on a matrix", function() {
                    var x = [
                        [ 1.5377,    0.6923,    1.6501,    3.7950,    5.6715],
                        [ 2.8339,    1.5664,    6.0349,    3.8759,    3.7925],
                        [-1.2588,    2.3426,    3.7254,    5.4897,    5.7172],
                        [ 1.8622,    5.5784,    2.9369,    5.4090,    6.6302],
                        [ 1.3188,    4.7694,    3.7147,    5.4172,    5.4889],
                    ];
                    var X = new Matrix(x);
                    var anovaObj = anova1(X);
                    $J.expect(anovaObj.p).toBeCloseTo(0.0023);
                    $J.expect(anovaObj.fStat).toBeCloseTo(6.05);
                });
            });
        });

    });

});