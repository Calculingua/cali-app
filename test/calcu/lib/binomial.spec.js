define([
  "$J",
  "cali-calcu/lib/distributions"
], function ($J, distributions) {
    var binomial = distributions.binomial;


    $J.describe("Binomial distribution functions", function() {

        $J.describe("binomial inverse cdf", function() {

            $J.it("Finds the inverse cdf of a binomial distribution", function() {
                $J.expect(binomial.inv(0.05, 162, 0.5)).toEqual(71);
                $J.expect(binomial.inv(0.95, 162, 0.5)).toEqual(91);
                $J.expect(binomial.inv(0.20, 100, 0.5)).toEqual(46);
                $J.expect(binomial.inv(0.50, 100, 0.5)).toEqual(50);
                $J.expect(binomial.inv(0.90, 100, 0.5)).toEqual(56);
                $J.expect(binomial.inv(0.50, 100, 0.03)).toEqual(3);
            });
        });
    });


});