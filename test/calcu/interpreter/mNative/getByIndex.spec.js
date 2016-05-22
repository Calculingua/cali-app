define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mNative.getByIndex", function () {


    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("getByIndex(A, i, j)", function () {

      it("should return correctly for matrix", function () {
        var setup = [
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",

        ]
        var inputs = [
          "getByIndex(x, 1, 1)",
          "getByIndex(x, 1, 2)",
          "getByIndex(x, 2, 2)",
          "getByIndex(x, 2:3, 2)",
          "getByIndex(x, 3, 1:2)",
          "getByIndex(x, 2:3, 1:2)",
        ];

        var datas = [
          [
            [1]
          ],
          [
            [2]
          ],
          [
            [5]
          ],
          [
            [5],
            [8]
          ],
          [
            [7, 8]
          ],
          [
            [4, 5],
            [7, 8]
          ],
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(setup[i], function () {
            parser.evaluate(inputs[i], function (err, ans) {
              expect(err).toBeFalsy();
              expect(ans[0].ans).toBeMatrixCloseTo(datas[i], epsilon);
            });
          });
        }
      });

      it("should return correctly for cell array", function () {
        var setup = [
          "x = {1, 2, 3; 4, 5, 6; 7, 8, 9}",
          "x = {'one', 'two'}",
          "x = {'one', 'two'}"
        ]
        var inputs = [
          "getByIndex(x, 1, 1)",
          "getByIndex(x, 1, 2)",
          "getByIndex(x, 1, [1,2])",
        ];

        var datas = [
          [
            [
              [
                [1]
              ]
            ]
          ],
          [
            [
              [
                ['t', 'w', 'o']
              ]
            ]
          ],
          [
            [
              [
                ['o', 'n', 'e']
              ],
              [
                ['t', 'w', 'o']
              ]
            ]
          ],
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(setup[i], function () {
            parser.evaluate(inputs[i], function (err, ans) {
              expect(err).toBeFalsy();
              expect(ans[0].ans.type).toEqual("CELL_ARRAY");
              expect(ans[0].ans.data).toEqual(datas[i].data);
            });
          });
        }
      });

      it("should return correctly for a table", function () {
        var setup = [
          "x = table([1; 2; 3], [4; 5; 6], 'VariableNames', {'one', 'two'})",
          "x = table([1; 2; 3], [4; 5; 6], 'VariableNames', {'one', 'two'}, 'RowNames', {'bill', 'aaron', 'chris'})",
          "x = table([1; 2; 3], [4; 5; 6], [7; 8; 9], 'VariableNames', {'one', 'two', 'three'}, 'RowNames', {'bill', 'aaron', 'chris'})",
          "x = table([1; 2; 3], [4; 5; 6], [7; 8; 9], 'VariableNames', {'one', 'two', 'three'}, 'RowNames', {'bill', 'aaron', 'chris'})",
          "x = table([1; 2; 3], [4; 5; 6], [7; 8; 9], 'VariableNames', {'one', 'two', 'three'}, 'RowNames', {'bill', 'aaron', 'chris'})",
        ]
        var inputs = [
          "getByIndex(x, 1, 1)",
          "getByIndex(x, 1:2, 1)",
          "getByIndex(x, 1:2, [2, 3])",
          "getByIndex(x, {'bill', 'aaron'}, [2, 3])",
          "getByIndex(x, {'bill', 'aaron'}, {'two', 'three'})",
        ];

        var datas = [
          {
            data: [
              [
                [1]
              ]
            ],
            properties: {
              VariableNames: ["one"],
              RowNames: []
            }
          },
          {
            data: [
              [
                [1],
                [2]
              ]
            ],
            properties: {
              VariableNames: ["one"],
              RowNames: ['bill', 'aaron']
            }
          },
          {
            data: [
              [
                [4],
                [5]
              ],
              [
                [7],
                [8]
              ]
            ],
            properties: {
              VariableNames: ["two", "three"],
              RowNames: ['bill', 'aaron']
            }
          },
          {
            data: [
              [
                [4],
                [5]
              ],
              [
                [7],
                [8]
              ]
            ],
            properties: {
              VariableNames: ["two", "three"],
              RowNames: ['bill', 'aaron']
            }
          },
          {
            data: [
              [
                [4],
                [5]
              ],
              [
                [7],
                [8]
              ]
            ],
            properties: {
              VariableNames: ["two", "three"],
              RowNames: ['bill', 'aaron']
            }
          },
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(setup[i], function () {
            parser.evaluate(inputs[i], function (err, ans) {
              expect(err).toBeFalsy();
              expect(ans[0].ans.type).toEqual("TABLE");
              expect(ans[0].ans.data).toEqual(datas[i].data);
              expect(ans[0].ans.properties.VariableNames).toEqual(datas[i].properties.VariableNames);
              expect(ans[0].ans.properties.RowNames).toEqual(datas[i].properties.RowNames);
            });
          });
        }
      });

      it("should emit exceptions", function () {
        var setup = [
          "x = table([1; 2; 3], [4; 5; 6], 'VariableNames', {'one', 'two'})",
          "x = table([1; 2; 3], [4; 5; 6], 'VariableNames', {'one', 'two'})",
          "x = [1, 2, 3; 4, 5, 6; 7, 8, 9]",
        ]
        var inputs = [
          "getByIndex(x, 1, 10)",
          "getByIndex(x, 1, {'three'})",
          "getByIndex(x, 1, 100)",
        ];

        var ex = [
          "Operator Error :: getByIndex :: Index exceeds dimensions.",
          "Operator Error :: getByIndex :: Unknown index.",
          "Operator Error :: getByIndex :: Index exceeds dimensions.",
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(setup[i], function () {
            parser.evaluate(inputs[i], function (err, ans) {
              expect(err).toEqual(ex[i]);
            });
          });
        }
      });
    });
  });

});
