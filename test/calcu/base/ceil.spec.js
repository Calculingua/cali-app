define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
], function ($J, CommandParser, Matchers) {
	
	$J.describe("cali.module.base.ceil", function(){
	
		// setup the environment
		var parser = null;
		var eye = null;
		var eps;
		$J.beforeEach(function() {
			parser = new CommandParser();
			$J.jasmine.Expectation.addMatchers(Matchers);
			eps = 1e-4;
		});
	
    $J.describe("ceil(x)", function(){
        $J.beforeEach(function (done) {
            parser.evaluate("x = [.91, 1.15, 1.41, 1.49, 1.59, 1.91; 100.11, 99.99, 100.41, 100.49, 100.55, 100.90]", done);
        });
        
  		$J.it("should round toward positive infinity", function(){
            var inputs = [
                "ceil(x(1,1))",
                "ceil(x(1,2))",
                "ceil(x)",
                "ceil(x(1, :))",
            ];
      
            var outputs = [
                [[1]],
                [[2]],
                [[1, 2, 2, 2, 2, 2], [101, 100, 101, 101, 101, 101]],
                [[1, 2, 2, 2, 2, 2]],
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