define([
  "$J",
  "cali-calcu/CommandParser",
  "sinon"
], function ($J, CommandParser, sinon) {
  
  var describe = $J.describe;
  var beforeEach = $J.beforeEach;
  var afterEach = $J.afterEach;
  var before = $J.before;
  var after = $J.after;


  function MockController() {
    this.output = {
      createPlot: function (data, opts, callback) {
        callback(null)
      },
      editPlot: function (pp, data, opts, callback) {
        callback(null)
      }
    };
  }

  describe("cali.module.base.plot(fname)", function () {

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
      });

      afterEach(function () {
        controller.output.createPlot.restore();
      });

      it("should call the `createPlot` method", function (done) {
        var err, ans, done;
        var input = "plot([1, 2], [1, 2])";

        parser.evaluate(input, function (e, a) {
          err = e;
          ans = a;
          expect(controller.output.createPlot.callCount).toEqual(1);
          done();
        });
      });
    });

    describe("arguments", function () {
      beforeEach(function () {
        sinon.stub(controller.output, "createPlot", function (data, opts, callback) {
          callback(null, "history-plot-0")
        });
        
        sinon.stub(controller.output, "editPlot", function (id, data, opts, callback) {
          callback(null, "history-plot-0")
        });
      });

      afterEach(function () {
        controller.output.createPlot.restore();
        controller.output.editPlot.restore();
      });

      describe("plot(X, Y)", function () {
        describe("if X and Y are both vectors", function () {
          it("should plot when they are the same length", function () {
            var inputs = [
              "plot([1, 2, 3], [1, 2, 3])",
              "plot([1; 2; 3], [1; 2; 3])",
              "plot([1; 2; 3], [1, 2, 3])",
              "plot([1, 2, 3], [1; 2; 3])"
            ];

            var datas = [
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ]}
              ],
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ]}
              ],
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ]}
              ],
              [
                {data: [
                  [1, 1],
                  [2, 2],
                  [3, 3]
                ]}
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
              "plot([1, 2], [1, 2, 3])",
              "plot([1; 2], [1; 2; 3])",
              "plot([1; 2], [1, 2, 3])"
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
          it("should plot when they are the same length", function () {
            var inputs = [
              "plot([1, 2, 3], [1, 4; 2, 5; 3, 6])",
              "plot([1, 2, 3], [1, 2, 3; 4, 5, 6])",
              "plot([1; 2; 3], [1, 2, 3; 4, 5, 6])",
              "plot([1; 2; 3], [1, 4; 2, 5; 3, 6])"
            ];

            var datas = [
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [1, 4],
                    [2, 5],
                    [3, 6]
                  ]
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
              "plot([1, 2, 3, 4], [1, 4; 2, 5; 3, 6])",
              "plot([1, 2, 3], [1, 2, 3, 4; 4, 5, 6, 7])",
              "plot([1; 2; 3; 4], [1, 2, 3; 4, 5, 6])",
              "plot([1; 2; 3], [1, 4; 2, 5; 3, 6; 8, 9])"
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
          it("should plot when they are the same length", function () {
            var inputs = [
              "plot([1, 1.1; 2, 2.2; 3, 3.3], [1, 4; 2, 5; 3, 6])"
            ];

            var datas = [
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [1.1, 4],
                    [2.2, 5],
                    [3.3, 6]
                  ]
                }
              ]
            ];

            var opts = [
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
              "plot([1, 1.1; 2, 2.2; 3, 3.3; 4, 4.4], [1, 4; 2, 5; 3, 6])"
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.callCount).toEqual(0);
                expect(err).toEqual("Plot Error :: vectors are of different lengths");
              });
            }
          });
        });

        describe("when X is an array and Y does not exist", function () {
          it("should plot vs the row index", function () {
            var inputs = [
              "plot([1.1, 2.2, 3.3])",
              "plot([1.1, 1.2; 2.1, 2.2; 3.1, 3.2])"
            ];

            var datas = [
              [
                {
                  // label: "y = 3",
                  data: [
                    [1, 1.1],
                    [2, 2.2],
                    [3, 3.3]
                  ]
                }
              ],
              [
                {
                  label: "0",
                  data: [
                    [1, 1.1],
                    [2, 2.1],
                    [3, 3.1]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [1, 1.2],
                    [2, 2.2],
                    [3, 3.2]
                  ]
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
        
        describe("plot(h, X, Y)", function () {
          it("should add to the plot", function () {
            var inputs = [
              ["hh = plot([1, 2, 3], [1, 2, 3])", "plot(hh, [2, 3, 4], [5; 6; 7])"],
            ];
            
            var datas = [
              [
                {
                  label: "0",
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ]
                },
                {
                  label: "1",
                  data: [
                    [2, 5],
                    [3, 6],
                    [4, 7]
                  ]
                }
              ]
            ]
            
            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i][0], function (err, ans) {
                parser.evaluate(inputs[i][1], function (err, ans) {
                  expect(controller.output.editPlot.getCall(i).args[1]).toEqual(datas[i]);
                });
              });
            }
          });
        });
      });
    });
  });

});

