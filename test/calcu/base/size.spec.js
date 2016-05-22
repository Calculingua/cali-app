define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon", 
  "../dev/Matchers",
  "cali-calcu/base/size",
], function ($J, CommandParser, sinon, Matchers, size) {
	
	$J.describe("cali.module.base.size(x)", function() {

		// setup the environment
		var parser = null;
		$J.beforeEach(function() {
			parser = new CommandParser();
		});

		$J.describe("returns the size input matrix `x`", function() {

	        // it("should return the size of various vectors, matrices and scalars", function() {
	//             var inputs = [
	//                 1,
	//                 [1,2,3],
	//             ];
	//             var outputs = [
	//                 [[0, 0]],
	//                 [[0, 3]],
	//             ];
	//             for (var i=0; i<inputs.length; i++) {
	//                 expect( size(inputs[i]) ).toEqual(outputs[i]);
	//             }
	//         });

			$J.it("should return the size of a 2x3", function() {
				var x = [ [ 3, 4, 5 ], [ 2, 3, 4 ] ];
				var ans = size(x);
				$J.expect(ans[0][0]).toEqual(2);
				$J.expect(ans[0][1]).toEqual(3);
			});

			$J.it("should return the size of a 3x1", function() {
				var x = [ [ 3 ], [ 4 ], [ 5 ] ];
				var ans = size(x);
				$J.expect(ans[0][0]).toEqual(3);
				$J.expect(ans[0][1]).toEqual(1);
			});

			$J.it("should return the size of a 1x3", function() {
				var x = [ [ 3, 4, 5 ] ];
				var ans = size(x);
				$J.expect(ans[0][0]).toEqual(1);
				$J.expect(ans[0][1]).toEqual(3);
			});

			$J.it("should return the size of a 1x1", function() {
				var x = [ [ 3 ] ];
				var ans = size(x);
				$J.expect(ans[0][0]).toEqual(1);
				$J.expect(ans[0][1]).toEqual(1);
			});

			$J.it("should return the size of a 1x1", function() {
				var x = [ [] ];
				var ans = size(x);
				$J.expect(ans[0][0]).toEqual(0);
				$J.expect(ans[0][1]).toEqual(0);
			});
		});

		$J.describe("integrates with the command parser", function() {

			$J.it("should return the size of a single number", function(){
				var input = "size(2)";
				var correct = [ [ 1, 1 ] ];
				parser.evaluate(input, function(err, ans){

					$J.expect(ans[0].ans).toEqual(correct);
				});
			});
		
			$J.it("should return the size of a variable", function(){
				var input0 = "x = [4, 5];";
				parser.evaluate(input0);
			
				var input = "size(x)";
				var correct = [ [ 1, 2 ] ];
				parser.evaluate(input, function(err, ans){

					$J.expect(ans[0].ans).toEqual(correct);
				});
			});
		
		});
	});
});