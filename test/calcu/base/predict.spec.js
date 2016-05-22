define([
    "../dev/Matchers",
    "$J",
    "cali-calcu/base/fitlm",
    "cali-calcu/base/predict"
], function (Matchers, $J, fitlm,predict) {

    $J.describe("cali.base.predict", function () {

        $J.beforeEach(function () {
            $J.jasmine.Expectation.addMatchers(Matchers);
        });

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

        var linearModel = fitlm(X, Y);
        linearModel.fit();

        $J.it("should correctly predict", function () {
            var response = predict(linearModel,[[[1,2]]]);
            $J.expect(response[0][0]).toBeCloseTo(8);
        });
        
    });


});

