define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/baseFunctions"
], function ($J, CommandParser, Matchers, base) {
	
	$J.describe("cali.module.base.expm", function(){
    
	  // setup the environment
	  var parser = null;
	  var eps;
	  $J.beforeEach(function() {
	      parser = new CommandParser();
	      $J.jasmine.Expectation.addMatchers(Matchers);
	      eps = 1e-4;
	  });

	  $J.it("should computes the matrix exponential of the input", function(){
      // Some tests come from
      // http://cran.r-project.org/web/packages/expm/expm.pdf page 7 & 8
      var inputs = [
          [[1,1,0], [0,0,2], [0,0,-1]],
          [[4,2,0], [1,4,1], [1,1,4]],
          [[-131, 19, 18],
           [-390, 56, 54],
           [-387, 57, 52]]
      ];
      var outputs = [
          [[2.7183,1.7183,1.0862], [0,1,1.2642], [0,0,0.3679] ],
          [[147.86662244637000, 183.76513864636857, 71.79703239999643],
           [127.78108552318250, 183.76513864636877, 91.88256932318409],
           [127.78108552318204, 163.67960172318047, 111.96810624637124]],
          [[-1.5096441587713636, 0.36787943910439874, 0.13533528117301735],
           [-5.6325707997970271, 1.47151775847745725, 0.40600584351567010],
           [-4.9349383260294299, 1.10363831731417195, 0.54134112675653534]]
      ];


      for(var i in inputs){
          $J.expect(base.expm(inputs[i])).toBeMatrixCloseTo(outputs[i], eps);
      }
	  });
	});
});