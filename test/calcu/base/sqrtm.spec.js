define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/sqrtm"
], function ($J, CommandParser, Matchers, sqrtm) {

$J.describe("cali.module.base.sqrtm", function(){
    
    // setup the environment
    var parser = null;
    var eps;
    beforeEach(function() {
        parser = new CommandParser();
        jasmine.Expectation.addMatchers(Matchers);
        eps = 1e-4;
    });
    
    it("should compute the square root of the input matrix", function(){
        var inputs = [
            [[5,-4, 1, 0, 0],
             [-4, 6,-4, 1, 0],
             [1,-4, 6,-4, 1],
             [0, 1,-4, 6,-4],
             [0, 0, 1,-4, 5]],

        ];
        var outputs = [
            [[2,-1,-0,-0,-0],
             [-1, 2,-1, 0,-0],
             [0,-1, 2,-1, 0],
             [-0, 0,-1, 2,-1],
             [-0,-0,-0,-1, 2]],
        ];
        
        for(var i in inputs){
            expect(sqrtm(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
        }
    });
    
});
});