define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function ($J, CommandParser, Matchers) {
	
	$J.describe("element-wise exponentials", function(){
	
		// setup the environment
		var parser = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
		$J.describe("cali.module.base.power", function(){
		
			$J.it("should compute the power of the array input", function(){
				var inputs = [
					"power(2, 2)",
					"power([2, 3], [2, 2])",
					"power([2, 3; 3, 2], [2, 2; 3, 3])",
					"power([2, 3; 3, 2], 2)",
					"power([2, 3; 3, 2], [2])",
				];
				var outputs = [
					[[4]],
					[[4, 9]],
					[[4, 9], [27, 8]],
					[[4, 9], [9, 4]],
					[[4, 9], [9, 4]],
				];
		
				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toBeFalsy();
						$J.expect(ans[0].ans).toBeMatrixCloseTo(outputs[i], eps);
					});
				}
			});
		
			$J.it("should error when arrays are miss-sized", function(){
				var inputs = [
					"power(2, [2, 3])",
					"power([2, 3], [2, 2, 3])",
					"power([2, 3; 3, 2], [3, 3])",
				];

				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toEqual("Operator Error : power : Matrices are miss-sized.")
					});
				}
			});
		
			$J.it("should error a non-matrix is input", function(){
				var inputs = [
					"power()",
					"power({2}, [2, 3])",
					"power([2, 3], {2, 2, 3})",
				];

				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toEqual("Operator Error : power : Only matrix inputs are allowed.")
					});
				}
			});
		});
	
		$J.describe("cali.module.base.exp", function(){
		
			it("should compute the power of the array input", function(){
				var inputs = [
					"exp(2)",
					"exp([2, 3])",
					"exp([2, 3; 3, 2])",
				];
				var outputs = [
					[[7.38906]],
					[[7.38906, 20.08554]],
					[[7.38906, 20.08554], [20.08554, 7.38906]],
				];
		
				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toBeFalsy();
						$J.expect(ans[0].ans).toBeMatrixCloseTo(outputs[i], eps);
					});
				}
			});
		
			$J.it("should error a non-matrix is input", function(){
				var inputs = [
					"exp({2})",
					"exp()",
				];

				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toEqual("Operator Error : exp : Only matrix inputs are allowed.")
					});
				}
			});
		});
	
		$J.describe("cali.module.base.sqrt", function(){
		
			$J.it("should compute the power of the array input", function(){
				var inputs = [
					"sqrt(2)",
					"sqrt([2, 3])",
					"sqrt([2, 3; 3, 2])",
				];
				var outputs = [
					[[1.41421]],
					[[1.41421, 1.73205]],
					[[1.41421, 1.73205], [1.73205, 1.41421]],
				];
		
				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toBeFalsy();
						$J.expect(ans[0].ans).toBeMatrixCloseTo(outputs[i], eps);
					});
				}
			});
		
			$J.it("should error a non-matrix is input", function(){
				var inputs = [
					"sqrt({2})",
					"sqrt()",
				];

				for(var i in inputs){
					parser.evaluate(inputs[i], function(err, ans){
						$J.expect(err).toEqual("Operator Error : sqrt : Only matrix inputs are allowed.")
					});
				}
			});
		});
	});
});