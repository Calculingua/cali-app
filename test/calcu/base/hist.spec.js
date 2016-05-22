define([
  "cali-calcu/base/hist",
  "$J",
  "cali-calcu/CommandParser",
  "cali-calcu/base/baseFunctions"
], function (hist, $J, CommandParser, base) {
	
	$J.describe("base.hist", function () {

	  var mockController = new MockController();
	  var parser = new CommandParser(undefined, undefined, mockController);

	  function round(n) {
	    return parseFloat(n.toFixed(2));
	  }

	  $J.describe("binning should return a vector with the counts: ", function () {

	    $J.it("should apply default bin number (ordered)", function () {
	      base.hist([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], function (error, counts, centers) {
	        $J.expect(counts).toEqual([[2, 2, 2, 2, 2]]);
	        $J.expect(centers[0].map(round), [1.9, 3.7, 5.5, 7.3, 9.1]);
	      });
	    });

	    $J.it("should apply default bin number (unordered)", function () {
	      base.hist([[1, 3, 5, 7, 9, 2, 4, 6, 8, 10]], function (error, result, centers) {
	        $J.expect(result).toEqual([[2, 2, 2, 2, 2]]);
	        $J.expect(centers[0].map(round), [1.9, 3.7, 5.5, 7.3, 9.1]);
	      });

	    });

	    $J.it("should use bin number from user (ordered)", function () {
	      base.hist([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], [[2]], function (error, result, centers) {
	        $J.expect(result).toEqual([[5, 5]]);
	        $J.expect(centers[0].map(round), [3.25, 7.75]);
	      });
	    });

	    $J.it("should use bin number from user (unordered)", function () {
	      base.hist([[1, 3, 5, 7, 9, 2, 4, 6, 8, 10]], [[2]], function (error, result, centers) {
	        $J.expect(result).toEqual([[5, 5]]);
	        $J.expect(centers[0].map(round), [3.25, 7.75]);
	      });
	    });

	    $J.it("wonky distribution should yield some zero counts", function () {
	      base.hist([[1, 1, 1, 10]], function (error, result, centers) {
	        $J.expect(result).toEqual([[3, 0, 1]]);
	        $J.expect(centers[0].map(round), [2.5, 5.5, 8.5]);
	      });
	    });

	    $J.it("faulty nbins argument should not be ignored (negative)", function () {

	      base.hist([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], [[-2]], function (error, result, centers) {
	        $J.expect(error).toBeTruthy();
	      });

	    });

	    $J.it("faulty nbins argument should not be ignored (string)", function () {

	      base.hist([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], [["asdf"]], function (error, result, centers) {
              $J.expect(error).toBeTruthy();
	      });


	    });

	    $J.it("faulty nbins argument should not be ignored (null)", function () {
	      base.hist([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], [[null]], function (error, result, centers) {
              $J.expect(error).toBeTruthy();
	      });
	    });


	    [
	      {command: "[counts, centers] = hist([0,1,2,4],2)",counts: [2, 2],centers: [1, 3]},
	      {command: "[counts, centers] = hist([0,1,2,4],1)",counts: [4],centers: [2]}
	    ].forEach(function (test, index) {
	        $J.it("integrates with interpreter (multiple assignment) (" + index + "): counts", function () {
	          parser.evaluate(test.command, function (err, result) {
	            $J.expect(result[0].ans[0]).toEqual(test.counts);
	          });
	        });
	        $J.it("integrates with interpreter (multiple assignment) (" + index + "): centers", function () {
	          parser.evaluate(test.command, function (err, result) {
	            $J.expect(result[1].ans[0]).toEqual(test.centers);
	          });
	        });
	      });

	    [
	      {command: "counts = hist([0,1,2,4],2)", counts: [2, 2]},
	      {command: "counts = hist([0,1,2,4],1)", counts: [4]}
	    ].forEach(function (test, index) {
	        $J.it("integrates with interpreter (single assignment) (" + index + "): counts", function () {
	          parser.evaluate(test.command, function (err, result) {
	            $J.expect(result[0].ans[0]).toEqual(test.counts);
	          });
	        });
	      });

	    [
	      {command: "hist([0,1,2,4],2)", counts: [2, 2]},
	      {command: "hist([0,1,2,4],1)", counts: [4]}
	    ].forEach(function (test, index) {
	        $J.it("integrates with interpreter (no assignment) (" + index + "): counts", function () {
	          parser.evaluate(test.command, function (err, result) {
	            $J.expect(result[0].ans[0]).toEqual(test.counts);
	          });
	        });
	      });
	  });



        $J.describe("hist should work with column vectors", function () {

           $J.it("hist function (row vector)", function(){
               hist.hist([[0,1,2,4]], function(error, result){
                   $J.expect(result).toEqual([[2,1,1]]);
               });
           });

            $J.it("hist function (column vector)", function(){
                hist.hist([[0],[1],[2],[4]], function(error, result){
                    $J.expect(result).toEqual([[2,1,1]]);
                });
            });

        });

	});

	function MockController() {
	  this.output = {
	    createPlot: function (data, opts, callback) {
	      callback(null)
	    },
	    editPlot: function (data, opts, callback) {
	      callback(null)
	    }
	  };
	}
});