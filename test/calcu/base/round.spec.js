define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
], function ($J, CommandParser, Matchers) {
	
	$J.describe("cali.module.base.round", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
    $J.describe("round(x, places)", function(){
        $J.beforeEach(function (done) {
            parser.evaluate("x = [.91, 1.15, 1.41, 1.49, 1.59, 1.91; 100.11, 99.99, 100.41, 100.49, 100.55, 100.90]", done);
        });
        
  		$J.it("should round the nearest decimal place", function(){
            var inputs = [
                "round(x(1,1))",
                "round(x(1,2))",
                "round(x(1,:), 0)",
                "round(x(1,:), 1)",
                "round(x(1,:), 1.1)",
                "round(x(1,:), 1.9)",
                "round(x, 1)",
                "round(x, -2)",
                "round([11, 14, 15; 22, 24, 24.9], -1)",
                "round(ones(3)*10, -1)",
            ];
      
            var outputs = [
                [[1]],
                [[1]],
                [[1, 1, 1, 1, 2, 2]],
                [[0.9, 1.2, 1.4, 1.5, 1.6, 1.9]],
                [[0.9, 1.2, 1.4, 1.5, 1.6, 1.9]],
                [[0.9, 1.2, 1.4, 1.5, 1.6, 1.9]],
                [[0.9, 1.2, 1.4, 1.5, 1.6, 1.9], [100.1, 100, 100.4, 100.5, 100.6, 100.9]],
                [[0, 0, 0, 0, 0, 0], [100, 100, 100, 100, 100, 100]],
                [[10, 10, 20],[20, 20, 20]],
                [[10, 10, 10], [10, 10, 10], [10, 10, 10]],
            ];
            for(var i = 0; i < inputs.length; i++){
                parser.evaluate(inputs[i], function (err, ans) {
                    expect(err).toBeFalsy();
                    expect(ans[0].name).toEqual("ans");
                    expect(ans[0].ans).toEqual(outputs[i]);
                });
            }
  		});
    })
	});
});