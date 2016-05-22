define([
    "../../dev/Matchers",
    "./testData",
    "$J",
    "cali-calcu/lib/linearmodel/Linearmodel",
    "cali-calcu/lib/NdArray"
], function (Matchers, testData, $J, Linearmodel, NdArray) {



    $J.describe("Linear Model", function () {

        $J.beforeEach(function () {
            $J.jasmine.Expectation.addMatchers(Matchers);
        });

        var tolerance = 0.1;

        var lm = new Linearmodel(new NdArray(testData.variablesArray), new NdArray(testData.responseArray));
        lm.fit();
        var precision = 4;

        $J.describe("object creation should work", function () {
            var lm1 = new Linearmodel(new NdArray(testData.variablesArray), new NdArray(testData.responseArray));
            lm1.fit();
            var lm2 = new Linearmodel(new NdArray(testData.variablesArray), new NdArray(testData.responseArray));
            lm2.fit();
            $J.it("should not share state across instances", function () {
                $J.expect(lm1.coefficients !== lm2.coefficients).toEqual(true);
            });
        });

        $J.describe("LinearModel#serialize", function(){
            $J.it("round trip should work", function(){
                var data = lm.serialize();
                var linearModel = Linearmodel.deserialize(data);
                $J.expect(linearModel.equals(lm)).toEqual(true);
            });
        });

        $J.describe("LinearModel#predict", function () {
            var predict = lm.predict(lm.variables);
            testData.responseArray.forEach(function (expectation, index) {
                $J.it("should estimate valuables correctly: " + index, function () {
                    $J.expect(predict[index]).toBeInTolerance(expectation, tolerance);
                });
            });
        });

        $J.describe("LinearModel#display", function () {

            $J.it("json dump should be correct", function(){
                var json = lm.jsonDisplay();
                $J.expect(json.title).toEqual("Linear regression model");
                $J.expect(json.model).toEqual("y ~ 1 + x1 + x2 + x3 + x4 + x5 + x6");
                $J.expect(lm.coefficients.estimate.length).toEqual(7);
                $J.expect(json.coefficientTable.title).toEqual("Estimated Coefficients");

                $J.expect(json.coefficientTable.rows[0][0]).toEqual("");
                $J.expect(json.coefficientTable.rows[0][1]).toEqual("Estimate");
                $J.expect(json.coefficientTable.rows[0][2]).toEqual("SE");
                $J.expect(json.coefficientTable.rows[0][3]).toEqual("tStat");
                $J.expect(json.coefficientTable.rows[0][4]).toEqual("pValue");

                $J.expect(json.coefficientTable.rows[1][0]).toEqual("(Intercept)");
                $J.expect(json.coefficientTable.rows[2][0]).toEqual("x1");
                $J.expect(json.coefficientTable.rows[3][0]).toEqual("x2");
                $J.expect(json.coefficientTable.rows[4][0]).toEqual("x3");
                $J.expect(json.coefficientTable.rows[5][0]).toEqual("x4");
                $J.expect(json.coefficientTable.rows[6][0]).toEqual("x5");

                $J.expect(json.coefficientTable.rows[1][1]).toBeInTolerance(testData.NISTstandard.estimate[0], tolerance);
                $J.expect(json.coefficientTable.rows[2][1]).toBeInTolerance(testData.NISTstandard.estimate[1], tolerance);
                $J.expect(json.coefficientTable.rows[3][1]).toBeInTolerance(testData.NISTstandard.estimate[2], tolerance);
                $J.expect(json.coefficientTable.rows[4][1]).toBeInTolerance(testData.NISTstandard.estimate[3], tolerance);
                $J.expect(json.coefficientTable.rows[5][1]).toBeInTolerance(testData.NISTstandard.estimate[4], tolerance);
                $J.expect(json.coefficientTable.rows[6][1]).toBeInTolerance(testData.NISTstandard.estimate[5], tolerance);

            });

            $J.it("html representation should be correct", function(){
                var html = lm.display();
                $J.expect(html).toEqual("<div>Linear regression model</div><div>y ~ 1 + x1 + x2 + x3 + x4 + x5 + x6</div><div>Estimated Coefficients</div><table><tr><td></td><td>Estimate</td><td>SE</td><td>tStat</td><td>pValue</td></tr><tr><td>(Intercept)</td><td>-3482258.6345944684</td><td>166953.8224347388</td><td>-8522.41818217287</td><td>7.142973100972933e-39</td></tr><tr><td>x1</td><td>15.061872270912431</td><td>15.921548585222594</td><td>3.7747336016402584</td><td>0.0029805235072750936</td></tr><tr><td>x2</td><td>-0.03581917929246187</td><td>0.006279563970481623</td><td>-0.45201295935506536</td><td>0.3481442377599501</td></tr><tr><td>x3</td><td>-2.0202298038151922</td><td>0.09157494051008536</td><td>-6.675940406162895</td><td>0.000034427342189937655</td></tr><tr><td>x4</td><td>-1.0332268671731533</td><td>0.040176405630337766</td><td>-5.154780187339991</td><td>0.00031100576072392384</td></tr><tr><td>x5</td><td>-0.051104105654437904</td><td>0.04238872503668668</td><td>-0.24821648157973134</td><td>0.37618295593854256</td></tr><tr><td>x6</td><td>1829.1514646129076</td><td>85.402218848723</td><td>197.931580236731</td><td>6.7265899626245765e-21</td></tr></table><div>R-Squared: 0.9954790045773527</div>");
            });

        });

        $J.describe("fit", function () {
            $J.it("check coefficient data type", function () {
                $J.expect(typeof lm.coefficients.SE[0]).toEqual("number");
                $J.expect(typeof lm.coefficients.tStat[0]).toEqual("number");
                $J.expect(typeof lm.coefficients.pValue[0]).toEqual("number");
            });
        });


//        $J.describe("basic fitting", function () {
//
//            $J.it("creates a linear model by fitting", function () {
//                $J.expect(lm).toBeDefined();
//            });
//
//            $J.it("fits the correct coefficient estimates", function () {
//                $J.expect(lm.coefficients.estimate.length).toEqual(7);
//                $J.expect(lm.coefficients.estimate[0]).toBeCloseTo(testData.NISTstandard.estimate[0], precision);
//                $J.expect(lm.coefficients.estimate[1]).toBeCloseTo(testData.NISTstandard.estimate[1], precision);
//                $J.expect(lm.coefficients.estimate[2]).toBeCloseTo(testData.NISTstandard.estimate[2], precision);
//                $J.expect(lm.coefficients.estimate[3]).toBeCloseTo(testData.NISTstandard.estimate[3], precision);
//                $J.expect(lm.coefficients.estimate[4]).toBeCloseTo(testData.NISTstandard.estimate[4], precision);
//                $J.expect(lm.coefficients.estimate[5]).toBeCloseTo(testData.NISTstandard.estimate[5], precision);
//                $J.expect(lm.coefficients.estimate[6]).toBeCloseTo(testData.NISTstandard.estimate[6], precision);
//            });
//
//            $J.it("fits with the correct standard error", function () {
//                console.log("RESIDUALS SE 0", testData.NISTstandard.SE[0]);
//                $J.expect(lm.coefficients.SE.length).toEqual(7);
//                $J.expect(lm.coefficients.SE[0]).toBeCloseTo(testData.NISTstandard.SE[0], precision);
//                $J.expect(lm.coefficients.SE[1]).toBeCloseTo(testData.NISTstandard.SE[1], precision);
//                $J.expect(lm.coefficients.SE[2]).toBeCloseTo(testData.NISTstandard.SE[2], precision);
//                $J.expect(lm.coefficients.SE[3]).toBeCloseTo(testData.NISTstandard.SE[3], precision);
//                $J.expect(lm.coefficients.SE[4]).toBeCloseTo(testData.NISTstandard.SE[4], precision);
//                $J.expect(lm.coefficients.SE[5]).toBeCloseTo(testData.NISTstandard.SE[5], precision);
//                $J.expect(lm.coefficients.SE[6]).toBeCloseTo(testData.NISTstandard.SE[6], precision);
//            });
//
//            $J.it("fits with the correct tStat", function () {
//                $J.expect(lm.coefficients.tStat.length).toEqual(7);
//                $J.expect(lm.coefficients.tStat[0]).toBeCloseTo(testData.NISTstandard.tStat[0], precision);
//                $J.expect(lm.coefficients.tStat[1]).toBeCloseTo(testData.NISTstandard.tStat[1], precision);
//                $J.expect(lm.coefficients.tStat[2]).toBeCloseTo(testData.NISTstandard.tStat[2], precision);
//                $J.expect(lm.coefficients.tStat[3]).toBeCloseTo(testData.NISTstandard.tStat[3], precision);
//                $J.expect(lm.coefficients.tStat[4]).toBeCloseTo(testData.NISTstandard.tStat[4], precision);
//                $J.expect(lm.coefficients.tStat[5]).toBeCloseTo(testData.NISTstandard.tStat[5], precision);
//                $J.expect(lm.coefficients.tStat[6]).toBeCloseTo(testData.NISTstandard.tStat[6], precision);
//            });
//
//            $J.it("fits with the correct pValue", function () {
//                $J.expect(lm.coefficients.pValue.length).toEqual(7);
//                $J.expect(lm.coefficients.pValue[0]).toBeCloseTo(testData.NISTstandard.pValue[0], precision);
//                $J.expect(lm.coefficients.pValue[1]).toBeCloseTo(testData.NISTstandard.pValue[1], precision);
//                $J.expect(lm.coefficients.pValue[2]).toBeCloseTo(testData.NISTstandard.pValue[2], precision);
//                $J.expect(lm.coefficients.pValue[3]).toBeCloseTo(testData.NISTstandard.pValue[3], precision);
//                $J.expect(lm.coefficients.pValue[4]).toBeCloseTo(testData.NISTstandard.pValue[4], precision);
//                $J.expect(lm.coefficients.pValue[5]).toBeCloseTo(testData.NISTstandard.pValue[5], precision);
//                $J.expect(lm.coefficients.pValue[6]).toBeCloseTo(testData.NISTstandard.pValue[6], precision);
//            });
//
//
//        });
//
//
//
//        $J.describe("Logistic Regression", function() {
//
//            it("calculates a simple logistic regression", function() {
//                var X, Y, lm;
//                X = (new Matrix([[28,29,30,31,32,33]])).transpose();
//                Y = (new Matrix([[0.33333, 0.66667, 0.77778, 0.77778, 0.8, 0.93333]])).transpose();
//                var lm = new Linearmodel(X, Y);
//                lm.setDistribution('binomial');
//                lm.fit();
//                expect(lm).toBeDefined();
//                console.log("LOGISTIC REGRESSION", lm.coefficients);
//                expect(lm.coefficients.estimate[0]).toEqual(-17.2086);
//                expect(lm.coefficients.estimate[1]).toEqual(0.5934);
//            });


    });

});







