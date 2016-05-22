define([
  "$J",
  "cali-calcu/CommandParser"
], function ($J, CommandParser) {

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

  $J.describe("cali.module.base.legend(h, ...)", function () {

    // setup the environment
    var parser, opts, model, controller, view;
    beforeEach(function () {
      controller = new MockController();
      parser = new CommandParser(opts, model, controller);
    });

    describe("integrates with the command parser", function () {

      beforeEach(function () {
        sinon.stub(controller.output, "createPlot", function (data, opts, callback) {
          callback(null, "history-plot-0")
        });
        sinon.stub(controller.output, "editPlot", function (id, data, opts, callback) {
          callback(null, "history-plot-0")
        });
      });

      afterEach(function () {
        controller.output.editPlot.restore();
        controller.output.createPlot.restore();
      });

      describe("legend(h, 'str1', 'str2', ...), legend(h, {'str1', 'str2', ...})", function () {
        describe("if number of string match the number of lines", function () {
          it("should call editPlot with the id, and new plot data", function () {
            var plot = [
              "pp = plot([1, 2, 3], [1, 2, 3])",
              "pp = plot([1, 2, 3], [1, 2, 3; 4, 5 6]')",
              "pp = plot([1, 2, 3], [1, 2, 3; 4, 5 6]')",
              "pp = plot([1, 2, 3], [1, 2, 3; 4, 5 6]')",
            ];

            var legends = [
              "legend(pp, 'test0')",
              "legend(pp, 'test0', 'test1')",
              "legend(pp, {'test0', 'test1'})",
              "legend(pp, {'test0'; 'test1'})",
            ];

            var datas = [
              [
                {
                  label: "test0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                }
              ],
              [
                {
                  label: "test0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "test1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
                }
              ],
              [
                {
                  label: "test0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "test1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
                }
              ],
              [
                {
                  label: "test0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "test1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
                }
              ],
            ];

            for (var i = 0; i < legends.length; i++) {
              parser.evaluate(plot[i], function (err, ans) {
                var id = ans[0];
                parser.evaluate(legends[i], function (err, ans) {
                  expect(controller.output.editPlot.getCall(0).args[1]).toEqual(datas[i]);
                  expect(parser.variables.pp.context.data).toEqual(datas[i]);
                });
              });
              controller.output.editPlot.reset();
            }
          });
        });
        describe("when number of strings DO NOT match the number of lines", function () {
          it("should throw an error", function () {
            var plot = [
              "pp = plot([1, 2, 3], [1, 2, 3])",
              "pp = plot([1, 2, 3], [1, 2, 3; 4, 5 6]')",
            ];

            var legends = [
              "legend(pp, 'test0', 'test1')",
              "legend(pp, 'test0')",
            ];

            for (var i = 0; i < legends.length; i++) {
              parser.evaluate(plot[i], function (err, ans) {
                var id = ans[0];
                parser.evaluate(legends[i], function (err, ans) {
                  expect(controller.output.editPlot.callCount).toEqual(0);
                  expect(err).toEqual("Number of labels in the legend must equal the number of lines on the plot.");
                });
              });
              controller.output.editPlot.reset();
            }
          });
        });
        describe("when h is not a Handle.", function () {
          it("should throw an error", function () {
            var plot = [
              "x = 4;\npp = plot([1, 2, 3], [1, 2, 3])",
              "x = 4;\npp = plot([1, 2, 3], [1, 2, 3; 4, 5 6]')",
            ];

            var legends = [
              "legend(x, 'test0', 'test1')",
              "legend(x, 'test0')",
            ];

            for (var i = 0; i < legends.length; i++) {
              parser.evaluate(plot[i], function (err, ans) {
                var id = ans[0];
                parser.evaluate(legends[i], function (err, ans) {
                  expect(controller.output.editPlot.callCount).toEqual(0);
                  expect(err).toEqual("Can only add a legend to a plot.");
                });
              });
              controller.output.editPlot.reset();
            }
          });
        });
      });
    });
  });


});