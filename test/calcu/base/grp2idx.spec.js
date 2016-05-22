define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function ($J, CommandParser, Matchers) {

	$J.describe("cali.module.base.grp2idx", function(){
    
	    // setup the environment
	    var parser = null;
	    var eye = null;
	    var eps;

	    $J.beforeEach(function(done) {
	        parser = new CommandParser();
	        $J.jasmine.Expectation.addMatchers(Matchers);
	        eps = 1e-4;
	        parser.evaluate([
	            "age = [38, 43, 38, 40, 49];",
	            // "group = {'30s', '40s', '30s', '40s', '40s'};"
	        ].join('\n'), function(err, ans){
            
	            $J.expect(err).toBeFalsy();
	            done(err);
	        });
	    });
    
	    $J.it("should creates an index vector", function(){
        
	        parser.evaluate("[G, GN] = grp2idx([38, 43, 38, 40, 49])", function(err, anss){
	            $J.expect(err).toBeFalsy();
	            $J.expect(anss[0].ans).toEqual([[0, 2, 0, 1, 3]], eps);
	            var pS = [38, 43, 38, 40, 49];
	            // G is an array of indexes where GN[G[i]] = S[i]
	            var G = anss[0].ans[0];
	            var GN = anss[1].ans[0];

	            var S = G.map(function(idx) {
	                return GN[idx];
	            })
	            $J.expect([S]).toEqual([pS]);

	        });
	    });
	});
});