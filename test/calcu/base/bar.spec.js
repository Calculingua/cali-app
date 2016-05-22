define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon"
], function ($J, CommandParser, sinon) {


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


  $J.describe("cali.module.base.bar(bar)", function () {

    // setup the environment
    var parser, opts, model, controller, view;
    $J.beforeEach(function () {
      controller = new MockController();
      parser = new CommandParser(opts, model, controller);
    });

    describe("integrates with the command parser", function () {

      beforeEach(function () {
        sinon.stub(controller.output, "createPlot", function (data, opts, callback) {
          callback(null, "history-plot-0")
        });
      });

      afterEach(function () {
        controller.output.createPlot.restore();
      });
    });

    describe("arguments", function () {
      beforeEach(function () {
        sinon.stub(controller.output, "createPlot", function (data, opts, callback) {
          callback(null, "history-plot-0")
        });
      });

      afterEach(function () {
        controller.output.createPlot.restore();
      });

      describe("bar(X, Y)", function () {
        describe("if X and Y are both vectors", function () {
          it("should bar when they are the same length", function () {
            var inputs = [
              "bar([1, 2, 3], [1, 2, 3])",
              "bar([1; 2; 3], [1; 2; 3])",
              "bar([1; 2; 3], [1, 2, 3])",
              "bar([1, 2, 3], [1; 2; 3])"
            ];

            var datas = [
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ], bars: {show: true, barWidth: .75, lineWidth: 0, order: 0, fill: 0.9}}
              ],
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ], bars: {show: true, barWidth: .75, lineWidth: 0, order: 0, fill: 0.9}}
              ],
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ], bars: {show: true, barWidth: .75, lineWidth: 0, order: 0, fill: 0.9}}
              ],
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ], bars: {show: true, barWidth: .75, lineWidth: 0, order: 0, fill: 0.9}}
              ]
            ];

            var opts = [
              null,
              null,
              null,
              null
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.getCall(i).args[0]).toEqual(datas[i]);
                expect(controller.output.createPlot.getCall(i).args[1]).toEqual(opts[i]);
              });
            }
          });

          it("should error when they are different lengths", function () {
            var inputs = [
              "bar([1, 2], [1, 2, 3])",
              "bar([1; 2], [1; 2; 3])",
              "bar([1; 2], [1, 2, 3])"
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.callCount).toEqual(0);
                expect(err).toEqual("Plot Error :: vectors are of different lengths");
              });
            }
          });
        });

        describe("if X is a vector and Y is a matrix", function () {
          it("should bar when they are the same length", function () {
            var inputs = [
              "bar([1, 2, 3], [1, 4; 2, 5; 3, 6])",
              "bar([1, 2, 3], [1, 2, 3; 4, 5, 6])",
              "bar([1; 2; 3], [1, 2, 3; 4, 5, 6])",
              "bar([1; 2; 3], [1, 4; 2, 5; 3, 6])"
            ];

            var datas = [
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 0, fill: 0.9}
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 1, fill: 0.9}
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 0, fill: 0.9}
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 1, fill: 0.9}
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 0, fill: 0.9}
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 1, fill: 0.9}
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 0, fill: 0.9}
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 1, fill: 0.9}
                }
              ]
            ];

            var opts = [
              null,
              null,
              null,
              null
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.getCall(i).args[0]).toEqual(datas[i]);
                expect(controller.output.createPlot.getCall(i).args[1]).toEqual(opts[i]);
              });
            }
          });

          it("should error when they are different lengths", function () {
            var inputs = [
              "bar([1, 2, 3, 4], [1, 4; 2, 5; 3, 6])",
              "bar([1, 2, 3], [1, 2, 3, 4; 4, 5, 6, 7])",
              "bar([1; 2; 3; 4], [1, 2, 3; 4, 5, 6])",
              "bar([1; 2; 3], [1, 4; 2, 5; 3, 6; 8, 9])"
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.callCount).toEqual(0);
                expect(err).toEqual("Plot Error :: vectors are of different lengths");
              });
            }
          });
        });
        describe("when X and Y are matrices", function () {
          it("should error", function () {
            var inputs = [
              "bar([1, 1.1; 2, 2.2; 3, 3.3], [1, 4; 2, 5; 3, 6])"
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.callCount).toEqual(0);
                expect(err).toEqual("Plot Error :: first argument should be a vector when second argument is used.");
              });
            }
          });
        });

        describe("when X is an array and Y does not exist", function () {
          it("should bar vs the row index", function () {
            var inputs = [
              "bar([1.1, 2.2, 3.3])",
              "bar([1.1, 1.2; 2.1, 2.2; 3.1, 3.2])"
            ];

            var datas = [
              [
                {
                  data: [
                    [1, 1.1],
                    [2, 2.2],
                    [3, 3.3]
                  ],
                  bars: {show: true, barWidth: .75, lineWidth: 0, order: 0, fill: 0.9}
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1.1],
                    [2, 2.1],
                    [3, 3.1]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 0, fill: 0.9}
                },
                {
                  label: "1",
                  data: [
                    [1, 1.2],
                    [2, 2.2],
                    [3, 3.2]
                  ],
                  bars: {show: true, barWidth: 0.375, lineWidth: 0, order: 1, fill: 0.9}
                }
              ]
            ];

            var opts = [
              null,
              null
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.getCall(i).args[0]).toEqual(datas[i]);
                expect(controller.output.createPlot.getCall(i).args[1]).toEqual(opts[i]);
              });
            }
          });
        });
      });
    });
  });

});
