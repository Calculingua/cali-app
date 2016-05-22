define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function ($J, CommandParser, Matchers) {
	
	$J.describe("cali.module.base.unique", function(){
    
	    // setup the environment
	    var parser = null;
	    var eps;
	    $J.beforeEach(function() {
	        parser = new CommandParser();
	        $J.jasmine.Expectation.addMatchers(Matchers);
	        eps = 1e-4;
	    });
    
	    $J.it("should return the unique values of A", function(){
        
	        parser.evaluate("[C, ia, ic] = unique([9, 2, 9, 5])", function(err, anss){
	            $J.expect(err).toBeFalsy();
	            $J.expect(anss[0].ans).toEqual([[2, 5, 9]], eps);
	            var pA = [9,2,9,5];
	            var ia = anss[1].ans[0];
	            var ic = anss[2].ans[0];
	            var i;

	            var C = ia.map(function(idx) {
	                return pA[idx];
	            });
	            var A = ic.map(function(idx) {
	                return anss[0].ans[0][idx];
	            })
	            $J.expect([C]).toEqual(anss[0].ans);
	            $J.expect([A]).toEqual([pA]);
	        });
	    });
	});
});