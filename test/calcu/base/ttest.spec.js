define([
  "async",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (async,$J, CommandParser, Matchers) {

describe("cali.module.base.ttest", function(){
	
	// setup the environment
	var parser = null;
	var eye = null;
	var eps;
	beforeEach(function(done) {
		parser = new CommandParser();
		$J.jasmine.Expectation.addMatchers(Matchers);
		eps = 1e-4;
		parser.evaluate("data = [5, 2; 5.5, 3; 4.5, 3.5; 5, 4; 5, 4.5; 6, 7; 5, 3; 5, 2.5; 4.5, 3.5; 5, 4];", function(err, ans){
			done(err);
		});
	});
	
	it("should compute the ttest of the input", function(){
		
		var inputs = [
		"[h, p, ci, stats] = ttest(data(:, 1));",
		"[h, p, ci, stats] = ttest(data(:, 1)');",
		"[h, p, ci, stats] = ttest(data(:, 1), data(:,2));",
		"[h, p, ci, stats] = ttest(data(:, 1), 7);",
		"[h, p, ci, stats] = ttest(data);",
		"[h, p, ci, stats] = ttest(data(:, 2), 'Alpha', 0.00001);",
		"[h, p, ci, stats] = ttest(data(:, 1), 5);",
		];
		
		var outputs = [
			[[[1]], [[4.3324e-11]], [[4.7368], [5.3632]], {tstats : [[36.4769]], df : [[9]], sd : [[0.4378]]}],
			[[[1]], [[4.3324e-11]], [[4.7368], [5.3632]], {tstats : [[36.4769]], df : [[9]], sd : [[0.4378]]}],
			[[[1]], [[.0056]], [[0.5061], [2.1939]], {tstats : [[3.6188]], df : [[9]], sd : [[1.1797]]}],
			[[[1]], [[1.9461e-7]], [[4.7368], [5.3632]], {tstats : [[-14.0851]], df : [[9]], sd : [[0.4378]]}],
			[[[1, 1]], [[4.3324e-11, 0.1375e-4]], [[4.7368, 2.7139], [5.3632,  4.6861]], {tstats : [[36.4769, 8.4884]], df : [[9, 9]], sd : [[0.4378, 1.3784]]}],
			[[[0]], [[1.3745e-05]], [[ -0.1478], [7.5478]], {tstats : [[8.4884]], df : [[9]], sd : [[1.3784]]}],
			[[[0]], [[0.7263]], [[4.7368], [5.3632]], {tstats : [[0.3612]], df : [[9]], sd : [[0.4378]]}],
		];
		
		async.mapSeries(inputs, function(item, cb){
			parser.evaluate(item, cb);
		}, function(err, anss){
			expect(err).toBeFalsy();
			for(var i = 0; i < outputs.length; i++){
				expect(anss[i][0].ans).toBeMatrixCloseTo(outputs[i][0], eps);
				expect(anss[i][1].ans).toBeMatrixCloseTo(outputs[i][1], eps);
				expect(anss[i][2].ans).toBeMatrixCloseTo(outputs[i][2], eps);
				expect(anss[i][3].ans.type).toEqual("HASH_TABLE");
				expect(anss[i][3].ans.data.tstats).toBeMatrixCloseTo(outputs[i][3].tstats, eps);
				expect(anss[i][3].ans.data.df).toBeMatrixCloseTo(outputs[i][3].df, eps);
				expect(anss[i][3].ans.data.sd).toBeMatrixCloseTo(outputs[i][3].sd, eps);
			}
		});
	});
	
});
});