define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "async",
  "cali-calcu/base/baseFunctions",
], function ($J, CommandParser, sinon, Matchers, async, base) {

	$J.describe("chi-squared functions", function() {
		
	    $J.describe("cali.module.base.chi2cdf", function() {
	        // setup the environment
	        var parser = null;
	        var chi2cdf = base.chi2cdf;
	        $J.beforeEach(function() {
	            parser = new CommandParser();
	        });

	        $J.it("Should return the chi-squared cdf for x with dof", function() {
	            var inputs = [
	                {x: 2.706, df: 1},
	                {x: 0.711, df: 4},
	                {x:3.053, df: 11},
	            ];
	            var outputs = [
	                [[0.9]],
	                [[0.05]],
	                [[0.01]],
	            ];
	            for (var i=0; i<inputs.length; i++) {
	                $J.expect(chi2cdf(inputs[i].x, inputs[i].df)).toBeCloseTo(outputs[i], 3);
	            }
	        })
	    });



	    $J.describe("cali.module.base.chi2pdf", function() {
	        // setup the environment
	        var parser = null;
	        var chi2pdf = base.chi2pdf;
	        $J.beforeEach(function() {
	            parser = new CommandParser();
	        });

	        $J.it("Should return the chi-squared pdf for x with dof", function() {
	            var inputs = [
	                {x: 2.5, df: 1},
	                {x: 3, df: 4},
	                {x:5, df: 11},
	            ];
	            var outputs = [
	                [[0.07228896]],
	                [[0.16734762]],
	                [[0.04842918]],
	            ];
	            for (var i=0; i<inputs.length; i++) {
	                $J.expect(chi2pdf(inputs[i].x, inputs[i].df)).toBeCloseTo(outputs[i], 3);
	            }
	        })
	    });



	    $J.describe("cali.module.base.chi2inv", function() {
	        // setup the environment
	        var parser = null;
	        var chi2inv = base.chi2inv;
	        var chi2cdf = base.chi2cdf;
	        $J.beforeEach(function() {
	            parser = new CommandParser();
	        });

	        $J.it("Should Computes the inverse of the chi-square cdf", function() {
	            var inputs = [
	                {x: 2.706, df: 1},
	                {x: 0.711, df: 4},
	                {x:3.053, df: 11},
	            ];
	            for (var i=0; i<inputs.length; i++) {
	                var x = inputs[i].x;
	                var df = inputs[i].df;
	                $J.expect(chi2inv(chi2cdf(x,df),df)).toBeCloseTo(x, 4);
	            }
	        })
	    });

	    $J.describe("cali.module.base.chi2stat", function() {
	        // setup the environment
	        var parser = null;
	        var eps;
	        var chi2stat = base.chi2stat;
	        $J.beforeEach(function() {
	            parser = new CommandParser();
	            $J.jasmine.Expectation.addMatchers(Matchers);
	            eps = 1e-4;
	        });

	        $J.it("Should return the mean and variance", function() {
	            var inputs = [
	                "[m, v] = chi2stat(4)",
	                "[m, v] = chi2stat(5)",
	                "[m, v] = chi2stat(6)",
	                "[m, v] = chi2stat(7)",
	            ]

	            var outputs = [
	                [[[4]], [[8]]],
	                [[[5]], [[10]]],
	                [[[6]], [[12]]],
	                [[[7]], [[14]]],
	            ];

	            async.mapSeries(inputs, function(item, cb){
	                parser.evaluate(item, cb);
	            }, function(err, anss){
	                expect(err).toBeFalsy();
	                for(var i = 0; i < outputs.length; i++){
	                    $J.expect(anss[i][0].ans).toBeMatrixCloseTo(outputs[i][0], eps);
	                    $J.expect(anss[i][1].ans).toBeMatrixCloseTo(outputs[i][1], eps);
	                }
	            });
	        });
	    });

	    $J.describe("cali.module.base.chi2gof", function() {
	        // setup the environment
	        var parser = null;
	        var eps = null
	        var chi2gof = base.chi2gof;
	        $J.beforeEach(function(done) {
	            eps = 1e-4;
	            parser = new CommandParser();
	            $J.jasmine.Expectation.addMatchers(Matchers);
                var inputs = [
                    "pass = [50,51,48,51,50];",
                    "nopass = [10,0,0,0,0];",
                    'candy = [212, 147, 103, 50, 46, 42];',
                    'low = [25,32,18,20];',
                ].join('\n');
                parser.evaluate(inputs, done);

	        });

	        $J.it("Should perform a goodness of fit test", function() {
	            var inputs = [
	                "[h, p, stats] = chi2gof(pass);",
	                "[h, p, stats] = chi2gof(nopass);",
	            ];

	            var outputs = [
	                [ [[0]], [[0.99827]], {chi2stat: [[0.12]], df: [[4]], edges: undefined, bins: [50,51,48,51,50], E: [50,50,50,50,50]}],
	                [ [[1]], [[0.00000001]], {chi2stat: [[40]],   df: [[4]], edges: undefined, bins: [10,0, 0, 0, 0 ], E: [2, 2, 2, 2, 2 ]}],
	            ];

	            // parser.evaluate(inputs[0], function(err, ans) {
	            //     console.log("err", err);
	            //     console.log("ans", ans);
	            //     console.log("I am not showing up in the console.");
	            // });

	            var i=0;
	            async.each(inputs, function(item, cb){
	                parser.evaluate(item, function(err, ans) {
	                    $J.expect(err).toBeFalsy();
	                    $J.expect(ans[0].ans).toBeMatrixCloseTo(outputs[i][0], eps);
	                    $J.expect(ans[1].ans).toBeMatrixCloseTo(outputs[i][1], eps);
	                    $J.expect(ans[2].ans.type).toEqual("HASH_TABLE");
	                    $J.expect(ans[2].ans.data.chi2stat).toBeMatrixCloseTo(outputs[i][2].chi2stat, eps);
	                    $J.expect(ans[2].ans.data.df).toBeMatrixCloseTo(outputs[i][2].df, eps);
	                    i++;
	                    cb();
	                });
	            }, function(err, anss){});
	        });

            $J.it("should perform a GOF test on another set of data", function() {
                parser.evaluate("[h, p, stats] = chi2gof(candy);", function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    console.log("H", ans[0].ans[0][0]);
                    console.log("p", ans[1].ans[0][0]);
                    console.log("stats", ans[2].ans.data);
                });
            });

            $J.it("should set the alpha to another level", function() {
                parser.evaluate("[h, p, stats] = chi2gof(low, 'alpha', 0.2);", function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    console.log("H", ans[0].ans[0][0]);
                    console.log("p", ans[1].ans[0][0]);
                    console.log("stats", ans[2].ans.data);
                });
            });

	    });

	    $J.describe("cali.module.base.chi2rnd", function() {
	        // setup the environment
	        var parser = null;
	        $J.beforeEach(function() {
	            parser = new CommandParser();
	        });

	        $J.it("Should do something", function() {
	            var inputs = [

	            ];
	            var outputs = [

	            ];
	            for (var i=0; i<inputs.length; i++) {

	            }
	        })
	    });


        $J.describe("cali.module.base.chi2ind", function() {
            // set up the environment
            var parser, eps;

            /**
             * test taken from http://www.psychstat.missouristate.edu/introbook/sbk28m.htm
             * Frequency table:
             *              Males   Females Both    Total 
             * AIDS    Yes  4       2       3       9
             *         No   3       16      2       21
             * Total        7       18      5       30     
             *
             * Chi-sq:  7.657
             * df:      2
             * pValue:  0.022
             */ 
            $J.beforeEach(function(done) {
                eps = 1e-3;
                parser = new CommandParser();
                $J.jasmine.Expectation.addMatchers(Matchers);  

                parser.evaluate('freqTable = [4,2,3; 3,16,2];', done);              
            });

            $J.it("calculated chi2 and pValue from frequency table", function(done) {
                parser.evaluate('[x2, pval] = chi2ind(freqTable);', function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[0].ans[0][0]).toBeCloseTo(7.657, 3);
                    $J.expect(ans[1].ans[0][0]).toBeCloseTo(0.022, 3);
                    done();
                });
            });
        });

	});
});