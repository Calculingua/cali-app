define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mNative.Table", function () {
    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("table(var1, var2, ...)", function () {

      it("should return a Table with the specified variables", function () {
        var inputs = [
          "table([1, 2, 3]')",
          "table([1; 2; 3], [4; 5; 6])",
          "table([1, 2, 3], [4; 5; 6]')",
          "table([1, 2, 3]', [4; 5; 6])",
          "table([1; 2; 3], [4, 5, 6]')"
        ];

        var datas = [
          [
            [
              [1],
              [2],
              [3]
            ]
          ],
          [
            [
              [1],
              [2],
              [3]
            ],
            [
              [4],
              [5],
              [6]
            ]
          ],
          [
            [
              [1, 2, 3]
            ],
            [
              [4, 5, 6]
            ]
          ],
          [
            [
              [1],
              [2],
              [3]
            ],
            [
              [4],
              [5],
              [6]
            ]
          ],
          [
            [
              [1],
              [2],
              [3]
            ],
            [
              [4],
              [5],
              [6]
            ]
          ]
        ];

        var names = [
          [ "Var1" ],
          [ "Var1", "Var2" ],
          [ "Var1", "Var2" ],
          [ "Var1", "Var2" ],
          [ "Var1", "Var2" ]
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].name).toEqual("ans");
            expect(ans[0].ans.type).toEqual("TABLE");
            expect(ans[0].ans.data).toEqual(datas[i]);
            expect(ans[0].ans.properties.VariableNames).toEqual(names[i]);
          });
        }
      });

      it("should error when they have different numbers of rows", function () {
        var inputs = [
          "table([1; 2; 3], [4; 5; 6; 7])"
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(inputs[i], function (err, ans) {
            expect(ans.length).toEqual(0)
            expect(err).toEqual("Operation Error : TABLE : Variables must have the same number of rows.");
          });
        }
      });
    });

    describe("table(var1, var2, ..., 'VariableNames', {'Name1', 'Name2', ...})", function () {

      it("should return a Table with the specified variables", function () {
        var inputs = [
          "table([1; 2; 3], 'VariableNames', {'butts'})",
          "table([1; 2; 3], [4; 5; 6], 'VariableNames', {'butts', 'heads'})",
          "table([1; 2; 3], [4; 5; 6], 'VariableNames', {'butts 1', ' heads tails'})"
        ];

        var datas = [
          [
            [
              [1],
              [2],
              [3]
            ]
          ],
          [
            [
              [1],
              [2],
              [3]
            ],
            [
              [4],
              [5],
              [6]
            ]
          ],
          [
            [
              [1],
              [2],
              [3]
            ],
            [
              [4],
              [5],
              [6]
            ]
          ]
        ];

        var names = [
          [ "butts" ],
          [ "butts", 'heads' ],
          [ "butts_1", 'heads_tails' ]
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].name).toEqual("ans");
            expect(ans[0].ans.type).toEqual("TABLE");
            expect(ans[0].ans.data).toEqual(datas[i]);
            expect(ans[0].ans.properties.VariableNames).toEqual(names[i]);
          });
        }
      });

      it("should error if the length of the names doesn't match the length of the variables", function () {
        var inputs = [
          "table([1; 2; 3], [4; 5; 6], 'VariableNames', {'butts'})"
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operation Error : TABLE : The number of variable names must match the number of variables.");
            expect(ans.length).toEqual(0);
          });
        }
      });

      it("should error if there are duplicate names", function () {
        var inputs = [
          "table([1; 2; 3], [4; 5; 6], 'VariableNames', {'butts', 'butts'})"
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operation Error : TABLE : The variable names must be distinct.");
            expect(ans.length).toEqual(0);
          });
        }
      });

      it("should error if there is an unknown property", function () {
        var inputs = [
          "table('butts')"
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operation Error : TABLE : Unknown property.");
            expect(ans.length).toEqual(0);
          });
        }
      });
    });

    describe("table(var1, var2, ..., 'RowNames', {'Name1', 'Name2', ...})", function () {

      it("should return a Table with the specified variables", function () {
        var inputs = [
          "table([1; 2; 3], 'RowNames', {'butts', 'heads', 'tails'})",
        ];

        var datas = [
          [
            [
              [1],
              [2],
              [3]
            ]
          ]
        ];

        var names = [
          [ "butts", "heads", "tails" ]
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].name).toEqual("ans");
            expect(ans[0].ans.type).toEqual("TABLE");
            expect(ans[0].ans.data).toEqual(datas[i]);
            expect(ans[0].ans.properties.RowNames).toEqual(names[i]);
          });
        }
      });

      it("should error if the length of the names doesn't match the length of the columns", function () {
        var inputs = [
          "table([1; 2; 3], [4; 5; 6], 'RowNames', {'butts'})"
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operation Error : TABLE : The number of row names must match the number of variables.");
            expect(ans.length).toEqual(0);
          });
        }
      });

      it("should error if there are duplicate names", function () {
        var inputs = [
          "table([1; 2; 3], [4; 5; 6], 'RowNames', {'butts', 'butts', 'heads'})"
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operation Error : TABLE : The row names must be distinct.");
            expect(ans.length).toEqual(0);
          });
        }
      });
    });
        describe("Chained Methods", function () {
            
            beforeEach(function(done){
                parser.evaluate("tab = table([1, 2;3, 4; 5, 6], [10; 11; 12], 'VariableNames', {'butts', 'heads'});", done);
            });
            
            it("should allow inner access on returned columns", function () {
            
                var inputs = [
                    "tab.butts",
                    "tab.butts(1,1)",
                    "tab.butts(:,2)",
                    "tab.butts(2,:)"
                ]
                var test = [
                    [
                        [1, 2],
                        [3, 4],
                        [5, 6]
                    ],
                    [
                        [1]
                    ],
                    [
                        [2],
                        [4],
                        [6]
                    ],
                    [
                        [3, 4],
                    ],
                ];

                for (var i = 0; i < inputs.length; i++) {
                    parser.evaluate(inputs[i], function (err, ans) {
                        expect(err).toBeFalsy();
                        expect(ans[0].name).toEqual("ans");
                        // expect(ans[0].ans.type).toEqual("TABLE");
                        expect(ans[0].ans).toEqual(test[i]);
                    });
                }
            });
            
            it("should allow chained operations", function () {
            
                var inputs = [
                    "tab.butts * 2",
                    "tab.butts(1,1) * 10",
                    "tab.butts(:,2) + [1; 2; 3]",
                    "tab.butts(2,:) + ones(1, 2)",
                    "tab.butts*2",
                    "tab.butts(1,1)*10",
                    "tab.butts(:,2)+[1; 2; 3]",
                    "tab.butts(2,:)+ones(1, 2)",
                    "tab.butts(2,:).^2",
                    "tab.butts.^2"
                ];
                var test = [
                    [[2, 4],[6, 8],[10, 12]],
                    [[10]],
                    [[3],[6],[9]],
                    [[4, 5]],
                    [[2, 4],[6, 8],[10, 12]],
                    [[10]],
                    [[3],[6],[9]],
                    [[4, 5]],
                    [[9, 16]],
                    [[1, 4],[9, 16],[25, 36]],
                ];

                for (var i = 0; i < inputs.length; i++) {
                    parser.evaluate(inputs[i], function (err, ans) {
                        expect(err).toBeFalsy();
                        expect(ans[0].name).toEqual("ans");
                        // expect(ans[0].ans.type).toEqual("TABLE");
                        expect(ans[0].ans).toEqual(test[i]);
                    });
                }
            });
        });
    });
});