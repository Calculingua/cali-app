define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "async", 
  "cali-calcu/base/baseFunctions",
], function ($J, CommandParser, sinon, Matchers, async, base) {

	$J.describe("cali.module.base.crosstab", function() {
	    // setup the environment
	    var parser = null;
	    var eps = null

	    $J.beforeEach(function(done) {
	        eps = 1e-3;
	        parser = new CommandParser();
	        $J.jasmine.Expectation.addMatchers(Matchers);
        
	        var lines = [
	            'x = [1, 1, 2, 3, 1];',
	            'y = [1, 2, 5, 3, 1];',
                'colcol_x = [1; 2; 3];',
                'colcol_y = [1; 1; 2];',
                'colrow_x = [1; 2; 3];',
                'colrow_y = [1, 1, 2];',
                'rowcol_x = [1, 2, 3];',
                'rowcol_y = [1; 1; 2];',
	        ];
	        async.each(lines, function(line, cb) {
	            parser.evaluate(line, function(err, ans) {
	                if (err) {
	                    console.log("VAR ERR", err.message);
	                    console.log(err.stack);
	                }
	                $J.expect(err).toBeFalsy();
	                cb();
	            });
	        }, function(err) {
	            done(err);
	        });
	    });

	    $J.it("Should perform a crosstabulation", function(done) {
	        var inputs = [
	            "[table, chi2, p] = crosstab(x, y);",
	        ];

	        var outputs = [ 
	            [[2, 1, 0, 0],
	             [0, 0, 0, 1],
	             [0, 0, 1, 0]]
	        ];

	        // parser.evaluate(inputs[0], function(err, ans) {
	        //     console.log("err", err);
	        //     console.log("ans", ans);
	        //     console.log("I am not showing up in the console.");
	        // });

	        var i=0;
	        async.each(inputs, function(item, cb){
	            parser.evaluate(item, function(err, ans) {
	                if (err) {
	                    console.log("ERR", err.message);
	                    console.log(err.stack);
	                }
	                $J.expect(err).toBeFalsy();
	                $J.expect(ans[0].ans).toEqual(outputs[i]);
	                $J.expect(ans[1].ans).toBeMatrixCloseTo([[10]],eps);
	                $J.expect(ans[2].ans).toBeMatrixCloseTo([[0.12465202]],eps);
	                i++;
	                cb();
	            });
	        }, function(err, anss){
	            done();
	        });
	    });

        $J.it("should work with column vectors", function(done) {
            parser.evaluate('[tab] = crosstab(colcol_x, colcol_y);', function(err, ans) {
                expect(err).toBeFalsy();
                done();
            });
        });

        $J.it("should work with column x and row y vectors", function(done) {
            parser.evaluate('[tab] = crosstab(colrow_x, colrow_y);', function(err, ans) {
                expect(err).toBeFalsy();
                done();
            });
        });

        $J.it("should work with row x and column y vectors", function(done) {
            parser.evaluate('[tab] = crosstab(rowcol_x, rowcol_y);', function(err, ans) {
                expect(err).toBeFalsy();
                done();
            });
        });

	});

});