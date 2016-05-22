define([
    "$J",
    "cali-calcu/base/fitlm",
    "cali-calcu/base/display"
], function ($J, fitlm,display) {

    $J.describe("cali.module.base.display", function () {

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

        $J.it("should correctly return object with type", function () {
            var result = display(linearModel);
            $J.expect(typeof result.data).toEqual("object");
            $J.expect(result.type).toEqual("LINEAR_MODEL_DISPLAY");
        });

        $J.it("if this fails, something changed.", function(){
            var result = display(linearModel);
            $J.expect(result.data).toEqual({ title: 'Linear regression model', model: 'y ~ 1 + x1 + x2', coefficientTable: { title: 'Estimated Coefficients', rows: [ [ '', 'Estimate', 'SE', 'tStat', 'pValue' ], [ '(Intercept)', 2.4424906541753444e-13, 8.10143365796378e-14, 8.581277980398027e-7, 0.3183098852901781 ], [ 'x1', 1.9999999999999498, 1.7079321781276706e-14, 15303638.03874186, 1.3591292392591208e-15 ], [ 'x2', 2.9999999999999134, 2.9582253083989027e-14, 17442375.45319676, 1.0462581761996678e-15 ] ] }, rsquared: 0.9999999999999503 });
        });
        
    });


});

