define([
  "async",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (async,$J, CommandParser, Matchers) {

describe("cali.module.base.ttest2", function(){
    
    // setup the environment
    var parser = null;
    var eye = null;
    var eps;
    beforeEach(function(done) {
        parser = new CommandParser();
        $J.jasmine.Expectation.addMatchers(Matchers);
        eps = 1e-2;
        var lines = [
            "X1 = [91, 87, 99, 77, 88, 91];",
            "Y1 = [101, 110, 103, 93, 99, 104];",
            "X1t = [91; 87; 99; 77; 88; 91];",
            "Y1t = [101; 110; 103; 93; 99; 104];",
        ].join('\n');
        parser.evaluate(lines, function(err, ans){
            done(err);
        });
    });
    
    it("should compute the ttest of the input", function(){
        
        var inputs = [
            "[h, p, ci, stats] = ttest2(X1,Y1);",
            "[h, p, ci, stats] = ttest2(X1t,Y1t);",
            // "[h, p, ci, stats] = ttest(data(:, 1)');",
            // "[h, p, ci, stats] = ttest(data(:, 1), data(:,2));",
            // "[h, p, ci, stats] = ttest(data(:, 1), 7);",
            // "[h, p, ci, stats] = ttest(data);",
            // "[h, p, ci, stats] = ttest(data(:, 2), 'Alpha', 0.00001);",
            // "[h, p, ci, stats] = ttest(data(:, 1), 5);",
        ];
        
        var outputs = [
            [ [[1]], [[0.0063]], [[-21.1321, -4.5345]], {tstat: [[-3.4456]], df: [[10]], sd: [[6.4511]]} ],
            [ [[1]], [[0.0063]], [[-21.1321, -4.5345]], {tstat: [[-3.4456]], df: [[10]], sd: [[6.4511]]} ],
            // [[[1]], [[4.3324e-11]], [[4.7368], [5.3632]], {tstats : [[36.4769]], df : [[9]], sd : [[0.4378]]}],
            // [[[1]], [[4.3324e-11]], [[4.7368], [5.3632]], {tstats : [[36.4769]], df : [[9]], sd : [[0.4378]]}],
            // [[[1]], [[.0056]], [[0.5061], [2.1939]], {tstats : [[3.6188]], df : [[9]], sd : [[1.1797]]}],
            // [[[1]], [[1.9461e-7]], [[4.7368], [5.3632]], {tstats : [[-14.0851]], df : [[9]], sd : [[0.4378]]}],
            // [[[1, 1]], [[4.3324e-11, 0.1375e-4]], [[4.7368, 2.7139], [5.3632,  4.6861]], {tstats : [[36.4769, 8.4884]], df : [[9, 9]], sd : [[0.4378, 1.3784]]}],
            // [[[0]], [[1.3745e-05]], [[ -0.1478], [7.5478]], {tstats : [[8.4884]], df : [[9]], sd : [[1.3784]]}],
            // [[[0]], [[0.7263]], [[4.7368], [5.3632]], {tstats : [[0.3612]], df : [[9]], sd : [[0.4378]]}],
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
                expect(anss[i][3].ans.data.tstat).toBeMatrixCloseTo(outputs[i][3].tstat, eps);
                expect(anss[i][3].ans.data.df).toBeMatrixCloseTo(outputs[i][3].df, eps);
                expect(anss[i][3].ans.data.sd).toBeMatrixCloseTo(outputs[i][3].sd, eps);
            }
        });
    });
    
});
});