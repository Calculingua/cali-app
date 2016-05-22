define([
  "$J",
  "cali-calcu/lib/distributions"
], function ($J, distributions) {
    var poiss = distributions.poisson;


    $J.describe("poisson distribution functions", function() {

        $J.describe("poisson inverse cdf", function() {
            $J.it("finds the inverse cdf of a poisson distribution", function() {
                $J.expect(poiss.inv(poiss.cdf(0,1),1)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,2),2)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,3),3)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,4),4)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,5),5)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,6),6)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,7),7)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,8),8)).toEqual(0);
                $J.expect(poiss.inv(poiss.cdf(0,9),9)).toEqual(0);
                $J.expect(poiss.inv(0.00673, 5)).toEqual(0);
                $J.expect(poiss.inv(0.04, 5)).toEqual(1);
                $J.expect(poiss.inv(0.125, 5)).toEqual(2);
                $J.expect(poiss.inv(0.265, 5)).toEqual(3);
                $J.expect(poiss.inv(0.537, 50)).toEqual(50);
            });
        });

    });


});