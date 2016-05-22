define([
  "$J",
  "async",
  "sinon",
  "cali-calcu/interpreter/mBasic/CellArray",
  "cali-calcu/CommandParser",
  "../../dev/Matchers"
], function ($J, async, sinon, CellArray, CommandParser, Matchers) {

  var epsilon;

  $J.describe("cali.calcu.interpreter.mBasic.CellArray", function () {


    // setup the environment
    var parser = null; // the parser
    $J.beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    $J.it("should exist", function () {
      $J.expect(typeof CellArray).toEqual("function");
    });

    $J.describe("parser.preprocess", function () {

      $J.it("should return the correct tokens", function () {
        var cmds = ["{'foo0', 'foo1', 0, 1}", "{'foo0','foo1',0,1}", "{foo0,foo1,0,1}", "{foo0,foo1,0,[1, 2;3, 4]}"];
        var toks = [
          ["{", "'foo0'", ",", "'foo1'", ",", "0", ",", "1", "}", "\n"],
          ["{", "'foo0'", ",", "'foo1'", ",", "0", ",", "1", "}", "\n"],
          ["{", "foo0", ",", "foo1", ",", "0", ",", "1", "}", "\n"],
          ["{", "foo0", ",", "foo1", ",", "0", ",", "[", "1", ",", "2", ";", "3", ",", "4", "]", "}", "\n"]
        ];
        for (var i = 0; i < cmds.length; i++) {
          var args = parser.preprocess(cmds[i]);
          for (var j = 0; j < args.length; j++) {
            expect(args[j].token).toEqual(toks[i][j]);
          }
        }
      });
    });

    $J.describe("new CellArray(input, position, parent, operators)", function () {

      $J.describe("holds all of the arguments between matching brackets in `array`", function () {
        var input, exp, correct;
        $J.it("should have a single row of variables when seperated by commas", function () {
          input = ["{'foo0', 'foo1', 0, 1}", "{'foo0', 'foo1', 0, [1, 2; 3, 4]}"];
          correct = [
            [
              ["STRING", "STRING", "NUMBER", "NUMBER"]
            ],
            [
              ["STRING", "STRING", "NUMBER", "MATRIX"]
            ]
          ];
          for (var k = 0; k < input.length; k++) {
            var args = parser.preprocess(input[k]);
            exp = new CellArray(args, 0, null, parser.operators);
            $J.expect(exp.array.length).toEqual(correct[k].length);
            $J.expect(exp.array[0].length).toEqual(correct[k][0].length);
            for (var i = 0; i < exp.array.length; i++) {
              for (var j = 0; j < exp.array[i].length; j++) {
                $J.expect(exp.array[i][j].type).toEqual(correct[k][i][j]);
              }
            }
          }
        });

        $J.it("should have multiple rows when the colon is used", function () {
          input = ["{'foo0', 'foo1'; 0, 1}", "{'foo0', 'foo1'; [1, 2; 3, 4], 0}"];
          correct = [
            [
              ["STRING", "STRING"],
              ["NUMBER", "NUMBER"]
            ],
            [
              ["STRING", "STRING"],
              ["MATRIX", "NUMBER"]
            ]
          ];
          for (var k = 0; k < input.length; k++) {
            var args = parser.preprocess(input[k]);
            exp = new CellArray(args, 0, null, parser.operators);
            $J.expect(exp.array.length).toEqual(correct[k].length);
            $J.expect(exp.array[0].length).toEqual(correct[k][0].length);
            for (var i = 0; i < exp.array.length; i++) {
              for (var j = 0; j < exp.array[i].length; j++) {
                $J.expect(exp.array[i][j].type).toEqual(correct[k][i][j]);
              }
            }
          }
        });

        $J.it("should set the expression `printFlag` to `false`", function () {
          input = ["{'foo0', 'foo1', 0, 1}", "{'foo0', 'foo1';, 0, [1, 2; 3, 4]}"];
          correct = [
            [
              ["STRING", "STRING", "NUMBER", "NUMBER"]
            ],
            [
              ["STRING", "STRING"],
              ["NUMBER", "MATRIX"]
            ]
          ];
          for (var k = 0; k < input.length; k++) {
            var args = parser.preprocess(input[k]);
            exp = new CellArray(args, 0, null, parser.operators);
            $J.expect(exp.array.length).toEqual(correct[k].length);
            $J.expect(exp.array[0].length).toEqual(correct[k][0].length);
            for (var i = 0; i < exp.array.length; i++) {
              for (var j = 0; j < exp.array[i].length; j++) {
                // expect(exp.array[i][j].type).toEqual("EXPRESSION");
                $J.expect(exp.array[i][j].printFlag).toEqual(false);
                $J.expect(exp.array[i][j].type).toEqual(correct[k][i][j])
              }
            }
          }
        });
      });
    });

    $J.describe("#interpret(opts, callback)", function () {
      var input, exp, spy;

      $J.beforeEach(function () {
        exp = [];
        spy = [];
        input = ["{'foo0', 'foo1', 0, 1}", "{'foo0', 'foo1'; 0, [1, 2; 3, 4]}"];
        for (var k = 0; k < input.length; k++) {
          var args = parser.preprocess(input[k]);
          exp.push(new CellArray(args, 0, null, parser.operators));
        }
      });

      $J.it("should call interpret on each expression inside `array`", function (done) {
        async.each(exp, function (item, callback) {
          var spy = [];
          for (var i = 0; i < item.array.length; i++) {
            spy.push([]);
            for (var j = 0; j < item.array[i].length; j++) {
              spy[i].push(sinon.spy(item.array[i][j], "interpret"));
            }
          }
          item.interpret(parser, function (err, ans) {
            for (var i = 0; i < spy.length; i++) {
              for (var j = 0; j < spy[i].length; j++) {
                $J.expect(spy[i][j].callCount).toEqual(1);
              }
            }
            callback(err);
          });
        }, done);
      });

      $J.it("should return an array with type `CELLARRAY`", function (done) {
        async.each(exp, function (item, callback) {
          item.interpret(parser, function (err, ans) {
            $J.expect(ans.type).toEqual("CELL_ARRAY");
            callback(err);
          });
        }, done);
      });

      $J.it("should return an array with correct contents", function (done) {
        var correct = [
          [
            [
              [
                ['f', 'o', 'o', '0']
              ],
              [
                ['f', 'o', 'o', '1']
              ],
              [
                [0]
              ],
              [
                [1]
              ]
            ]

          ],
          [
            [
              [
                ['f', 'o', 'o', '0']
              ],
              [
                ['f', 'o', 'o', '1']
              ]
            ],
            [
              [
                [0]
              ],
              [
                [1, 2],
                [3, 4]
              ]
            ]
          ]
        ];
        var k = 0;
        async.eachSeries(exp, function (item, callback) {
          item.interpret(parser, function (err, ans) {
            for (var i = 0; i < ans.length; i++) {
              for (var j = 0; j < ans[i].length; j++) {
                $J.expect(ans[i][j]).toEqual(correct[k][i][j]);
              }
            }
            k++;
            callback(err);
          });
        }, done);
      });
    });

    $J.describe("parser.evaluate", function () {
      $J.it("should return the correct results", function (done) {

        var input = "x = {3, 4}";
        var correct = [
          [
            [
              [3]
            ],
            [
              [4]
            ]
          ]
        ];
        correct.type = "CELL_ARRAY";
        parser.evaluate(input, function (err, ans) {
          $J.expect(err).toBeFalsy();
          for (var i in correct) {
            $J.expect(ans[ans.length - 1].ans[i]).toEqual(correct[i]);
          }

          done();
        });
      });

      $J.it("should emit the results", function (done) {
        var spy = sinon.spy(parser, "emit");
        var input = "x = {3, 4}";
        var correct = [
          [
            [
              [3]
            ],
            [
              [4]
            ]
          ]
        ];
        correct.type = "CELL_ARRAY";
        parser.evaluate(input, function (err, ans) {
          $J.expect(spy.callCount).toEqual(2);
          $J.expect(spy.getCall(1).args[0]).toEqual("result");
          var ans = [
            [
              [
                [3]
              ],
              [
                [4]
              ]
            ]
          ];
          ans.type = "CELL_ARRAY";
          for (var i in ans) {
            $J.expect(spy.getCall(1).args[1].ans[i]).toEqual(ans[i]);
          }
          $J.expect(spy.getCall(1).args[1].ans.type).toEqual(ans.type);
          $J.expect(spy.getCall(1).args[1].name).toEqual("x");
          $J.expect(spy.getCall(1).args[2]).toEqual(true);
          done();
        });
      })
    })
  });

});