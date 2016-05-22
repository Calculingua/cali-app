define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions",
  "async",
], function ($J, CommandParser, sinon, Matchers, base, async) {
	
	$J.describe("cali.module.base.mpower", function(){
    
    // setup the environment
    var parser = null;
    var eps;
    var eye;
    $J.beforeEach(function() {
      parser = new CommandParser();
      mpower = base.mpower;
      eye = base.eye;
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
    });
  
	  $J.it("should compute A to the power of k", function(){
      var inputs = [
          {A: eye(3), k: 3},
          {A: [[-13,-10],[21,16]], k:2},
          {A: [[-13,-10],[21,16]], k:0.5},
          {A: [[0.55, 0.3], [0.45, 0.7]], k: 0.5}
      ];
      var outputs = [
          eye(3),
          [[-41,-30],[63,46]],
          [[-4.798989873,-4.142135624],[8.69848481, 7.213203436]],
          [[0.7,0.2], [0.3, 0.8]]
      ];
    
      for(var i in inputs){
          $J.expect(mpower(inputs[i].A, inputs[i].k)).toBeMatrixCloseTo(outputs[i], eps);
      }
    });
	});
});