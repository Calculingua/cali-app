define([
  "sinon",
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function (sinon, $J, CommandParser, Matchers) {

$J.describe("cali.module.base.xlim(h, [xmin, xmax])", function() {

	// setup the environment
	var parser, opts, model, controller, view;
	beforeEach(function() {
		controller = new MockController();
		parser = new CommandParser(opts, model, controller);
	});

	describe("integrates with the command parser", function() {

		beforeEach(function() {
			sinon.stub(controller.output, "createPlot", function(data, opts, callback) {
				callback(null, "history-plot-0")
			});
			sinon.stub(controller.output, "editPlot", function(id, data, opts, callback) {
				callback(null, "history-plot-0")
			});
		});

		afterEach(function() {
			controller.output.editPlot.restore();
			controller.output.createPlot.restore();
		});

		describe("xlim(h, [xmin, xmax])", function() {

			it("should call editPlot with the id, and new plot data", function(){
				var plot = [
					"pp = plot([1, 2, 3], [1, 2, 3])",
					"pp = plot([1, 2, 3], [1, 2, 3])",
				];
				
				var xlims = [
					"xlim(pp, [3, 4])",
					"xlim(pp, [3; 4])",
				];
									
				var datas = [
					[{	
						data: [[1, 1], [2, 2], [3, 3]]
					}],
					[{	
						data: [[1, 1], [2, 2], [3, 3]]
					}],
				];
				
				var opts = [
					{
						xaxis: {
							min: 3,
							max: 4
						}
					},
					{
						xaxis: {
							min: 3,
							max: 4
						}
					}
				];
				
				for(var i = 0; i < xlims.length; i++){
					parser.evaluate(plot[i], function(err, ans){
						var id = ans[0];
						parser.evaluate(xlims[i], function(err, ans){
							expect(controller.output.editPlot.getCall(0).args[1]).toEqual(datas[i]);
							expect(controller.output.editPlot.getCall(0).args[2]).toEqual(opts[i]);
							expect(parser.variables.pp.context.data).toEqual(datas[i]);
						});
					});
					controller.output.editPlot.reset();
				}
			});
			
			it("should return an error when the handle is not passed", function(){
				var plot = [
					"pp = plot([1, 2, 3], [1, 2, 3])",
				];
				
				var xlims = [
					"xlim([3, 4])",
				];
									
				for(var i = 0; i < xlims.length; i++){
					parser.evaluate(plot[i], function(err, ans){
						var id = ans[0];
						parser.evaluate(xlims[i], function(err, ans){
							expect(err).toEqual("Can only add axis limits to a plot.");
							expect(controller.output.editPlot.callCount).toEqual(0);
						});
					});
					controller.output.editPlot.reset();
				}
			});
			
			it("should return an error when the limits are not passed correctly", function(){
				var plot = [
					"pp = plot([1, 2, 3], [1, 2, 3])",
					"pp = plot([1, 2, 3], [1, 2, 3])",
					"pp = plot([1, 2, 3], [1, 2, 3])",
				];
				
				var xlims = [
					"xlim(pp)",
					"xlim(pp, [1])",
					"xlim(pp, [])",
				];
									
				for(var i = 0; i < xlims.length; i++){
					parser.evaluate(plot[i], function(err, ans){
						var id = ans[0];
						parser.evaluate(xlims[i], function(err, ans){
							expect(err).toEqual("Limits must be specified using a vector.");
							expect(controller.output.editPlot.callCount).toEqual(0);
						});
					});
					controller.output.editPlot.reset();
				}
			});
		});
	});
});
});

function MockController() {
	this.output = {
		createPlot: function(data, opts, callback) {
			callback(null)
		},
		editPlot: function(id, data, opts, callback) {
			callback(null)
		}
	};
}
