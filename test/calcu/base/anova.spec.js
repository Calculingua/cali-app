define([
  "$J",
  "cali-calcu/base/anova",
], function ($J, anova, Matrix) {

    $J.describe("ANOVA base methods", function () {
        $J.describe("1-way ANOVA methods", function() {
            $J.describe("balanced 1-way ANOVA method", function() {

                $J.it("should do a 1-way balanced ANOVA on a matrix", function() {
                    var x = [
                        [ 1.5377,    0.6923,    1.6501,    3.7950,    5.6715],
                        [ 2.8339,    1.5664,    6.0349,    3.8759,    3.7925],
                        [-1.2588,    2.3426,    3.7254,    5.4897,    5.7172],
                        [ 1.8622,    5.5784,    2.9369,    5.4090,    6.6302],
                        [ 1.3188,    4.7694,    3.7147,    5.4172,    5.4889],
                    ];
                    anova.anova1(x, function(err, p) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(p[0][0]).toBeCloseTo(0.0023);
                    });
                });

                $J.it("should do a 1way balanced ANOVA using grouping var", function() {
                    var x = [
                         1.5377,    0.6923,    1.6501,    3.7950,    5.6715,
                         2.8339,    1.5664,    6.0349,    3.8759,    3.7925,
                        -1.2588,    2.3426,    3.7254,    5.4897,    5.7172,
                         1.8622,    5.5784,    2.9369,    5.4090,    6.6302,
                         1.3188,    4.7694,    3.7147,    5.4172,    5.4889,
                    ];
                    var grp = [
                        'a',    'b',    'c',    'd',    'e',
                        'a',    'b',    'c',    'd',    'e',
                        'a',    'b',    'c',    'd',    'e',
                        'a',    'b',    'c',    'd',    'e',
                        'a',    'b',    'c',    'd',    'e',
                    ];
                    anova.anova1(x, grp, function(err, p) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(p[0][0]).toBeCloseTo(0.0023);
                    });

                });
            });
        });

    });

});