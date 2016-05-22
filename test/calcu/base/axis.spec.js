define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon"
], function ($J, CommandParser, sinon) {


  $J.describe("cali.module.base.axis(h, [xmin, xmax, ymin, ymax])", function () {

    // setup the environmentfatan
    var parser, opts, model, controller, view;
    $J.beforeEach(function () {
      controller = new MockController();
      parser = new CommandParser(opts, model, controller);
    });

    $J.describe("integrates with the command parser", function () {

      $J.beforeEach(function () {
        sinon.stub(controller.output, "createPlot", function (data, opts, callback) {
          callback(null, "history-plot-0")
        });
        sinon.stub(controller.output, "editPlot", function (id, data, opts, callback) {
          callback(null, "history-plot-0")
        });
      });

      $J.afterEach(function () {
        controller.output.editPlot.restore();
        controller.output.createPlot.restore();
      });

      $J.describe("axis(h, [xmin, xmax, ymin, ymax])", function () {

        $J.it("should call editPlot with the id, and new plot data", function () {
          var plot = [
            "pp = plot([1, 2, 3], [1, 2, 3])",
            "pp = plot([1, 2, 3], [1, 2, 3])"
          ];

          var axiss = [
            "axis(pp, [3, 4, 5, 6])",
            "axis(pp, [3; 4; 5; 6])"
          ];

          var datas = [
            [
              {
                data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ]
              }
            ],
            [
              {
                data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ]
              }
            ]
          ];

          var opts = [
            {
              xaxis: {
                min: 3,
                max: 4
              },
              yaxis: {
                min: 5,
                max: 6
              }
            },
            {
              xaxis: {
                min: 3,
                max: 4
              },
              yaxis: {
                min: 5,
                max: 6
              }
            }
          ];

          for (var i = 0; i < axiss.length; i++) {
            parser.evaluate(plot[i], function (err, ans) {
              parser.evaluate(axiss[i], function (err, ans) {
                $J.expect(controller.output.editPlot.getCall(0).args[1]).toEqual(datas[i]);
                $J.expect(controller.output.editPlot.getCall(0).args[2]).toEqual(opts[i]);
                $J.expect(parser.variables.pp.context.data).toEqual(datas[i]);
              });
            });
            controller.output.editPlot.reset();
          }
        });

        $J.it("should return an error when the handle is not passed", function () {
          var plot = [
            "pp = plot([1, 2, 3], [1, 2, 3])"
          ];

          var axiss = [
            "axis([3, 4])"
          ];

          for (var i = 0; i < axiss.length; i++) {
            parser.evaluate(plot[i], function (err, ans) {
              var id = ans[0];
              parser.evaluate(axiss[i], function (err, ans) {
                $J.expect(err).toEqual("Can only add axis limits to a plot.");
                $J.expect(controller.output.editPlot.callCount).toEqual(0);
              });
            });
            controller.output.editPlot.reset();
          }
        });

        $J.it("should return an error when the limits are not passed correctly", function () {
          var plot = [
            "pp = plot([1, 2, 3], [1, 2, 3])",
            "pp = plot([1, 2, 3], [1, 2, 3])",
            "pp = plot([1, 2, 3], [1, 2, 3])"
          ];

          var axiss = [
            "axis(pp)",
            "axis(pp, [1])",
            "axis(pp, [])"
          ];

          for (var i = 0; i < axiss.length; i++) {
            parser.evaluate(plot[i], function (err, ans) {
              var id = ans[0];
              parser.evaluate(axiss[i], function (err, ans) {
                $J.expect(err).toEqual("Limits must be specified using a vector.");
                $J.expect(controller.output.editPlot.callCount).toEqual(0);
              });
            });
            controller.output.editPlot.reset();
          }
        });
      });
    });
  });

  function MockController() {
    this.output = {
      createPlot: function (data, opts, callback) {
        callback(null)
      },
      editPlot: function (id, data, opts, callback) {
        callback(null)
      }
    };
  }

});
