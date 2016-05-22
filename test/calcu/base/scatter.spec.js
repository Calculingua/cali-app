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

  describe("cali.module.base.scatter()", function () {

    // setup the environment
    var parser, opts, model, controller, view;
    beforeEach(function () {
      controller = new MockController();
      parser = new CommandParser(opts, model, controller);
      
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

    describe("arguments", function () {
      describe("scatter(X, Y, a, c)", function () {
        describe("if X and Y are both vectors", function () {
          it("should plot when they are the same length", function () {
            var inputs = [
              "scatter([1, 2, 3], [1, 2, 3])",
              "scatter([1; 2; 3], [1; 2; 3])",
              "scatter([1; 2; 3], [1, 2, 3])",
              "scatter([1, 2, 3], [1; 2; 3])"
            ];

            var datas = [
              [
                {
                  data: [
                    [1, 1],
                    [2, 2],
                    [3, 3]
                  ],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 3,
                  }, 
                }
              ]
            ];

            var opts = [
              null,
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.getCall(i).args[0]).toEqual(datas[0]);
                expect(controller.output.createPlot.getCall(i).args[1]).toEqual(opts[0]);
              });
            }
          });
          
          it("should plot with `a` as the specified scalar size", function () {
            var inputs = [
              "scatter([1, 2, 3], [1, 2, 3], 36)",
              "scatter([1; 2; 3], [1; 2; 3], 48)",
              "scatter([1; 2; 3], [1, 2, 3], 54)",
              "scatter([1, 2, 3], [1; 2; 3], 12)"
            ];

            var datas = [
              [
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol : "circle",
                      radius : 3,
                  }, 
                }
              ],[
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 4,
                  }, 
                }
              ],[
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 4.5,
                  }, 
                }
              ],[
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 1,
                  }, 
                }
              ]
            ];

            var opts = [
              null,
              null,
              null,
              null,
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.getCall(i).args[0]).toEqual(datas[i]);
                expect(controller.output.createPlot.getCall(i).args[1]).toEqual(opts[i]);
              });
            }
          });
          
          it("should plot with `a` as the specified scalar size and `c` as the color", function () {
            var inputs = [
              "scatter([1, 2, 3], [1, 2, 3], 36, 'black')",
              "scatter([1; 2; 3], [1; 2; 3], 48, 'blue')",
              "scatter([1; 2; 3], [1, 2, 3], 54, '#fafafa')",
              "scatter([1, 2, 3], [1; 2; 3], 12, '#aaaaaa')"
            ];

            var datas = [
              [
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol : "circle",
                      radius : 3,
                  }, 
                  color: "black"
                }
              ],[
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 4,
                  }, 
                  color: "blue"
                }
              ],[
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 4.5,
                  }, 
                  color: "#fafafa",
                }
              ],[
                {
                  data: [[1, 1],[2, 2],[3, 3]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol: "circle",
                      radius : 1,
                  }, 
                  color: "#aaaaaa"
                }
              ]
            ];

            var opts = [
              null,
              null,
              null,
              null,
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
              "scatter([1, 2], [1, 2, 3])",
              "scatter([1; 2], [1; 2; 3])",
              "scatter([1; 2], [1, 2, 3])"
            ];

            for (var i = 0; i < inputs.length; i++) {
              parser.evaluate(inputs[i], function (err, ans) {
                expect(controller.output.createPlot.callCount).toEqual(0);
                expect(err).toEqual("Plot Error :: vectors are of different lengths");
              });
            }
          });
        });
        
        describe("scatter(h, X, Y)", function () {
          it("should add to the plot", function () {
            var inputs = [
              ["hh = plot([1, 2, 3], [1, 2, 3])", "scatter(hh, [2, 3, 4], [5; 6; 7])"],
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
                  data: [[2, 5],[3, 6],[4, 7]],
                  lines: {
                      show: false, 
                  },
                  points: { 
                      show : true,
                      symbol : "circle",
                      radius : 3,
                  }, 
                }
              ]
            ];
            
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

