define([
    "cali-calcu/lib/linearmodel/Linearmodel",
    "$J",
    "cali-calcu/base/fitlm"
], function (Linearmodel, $J, fitlm) {

    $J.describe("cali.module.base.fitlm", function () {

        $J.it("check correct module export", function () {
            $J.expect(typeof fitlm === "function").toEqual(true);
        });


        $J.it("should correctly return object", function () {

            var X = [
                [1, 2],
                [2, 2],
                [3, 1]
            ];
            var Y = [
                [8],
                [10],
                [9]
            ];

            var modelData = fitlm(X, Y);

            $J.expect(modelData instanceof Linearmodel).toEqual(true);
            $J.expect(modelData.coefficients.estimate[0]).toBeCloseTo(0);
            $J.expect(modelData.coefficients.estimate[1]).toBeCloseTo(2);
            $J.expect(modelData.coefficients.estimate[2]).toBeCloseTo(3);

        });
        
    });


});

