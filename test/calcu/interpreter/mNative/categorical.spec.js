define([
  "cali-calcu/mType/CellArrayType",
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function (CellArrayType, $J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mNative.categorical", function () {


    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("categorical(A, valueset, catnames)", function () {

      it("should return a categorical with the specified variables", function () {
        var inputs = [
          "categorical({'a', 'b', 'a', 'c'})",
          "categorical({'ab', 'bb', 'ab', 'cb'})",
          "categorical({'ab', 'bb', 'ab', 'cb'}, {'ab', 'bb', 'cb', 'db'})",
          "categorical({'ab', 'bb', 'ab', 'cb'}, {'ab', 'bb', 'cb', 'db'}, {'abba', 'babba', 'cabba', 'dabba'})",
          "categorical({'ab', 'bb', 'ab', 'cb'; 'bb', 'cb', 'bb', 'cb'}, {'ab', 'bb', 'cb', 'db'}, {'abba', 'babba', 'cabba', 'dabba'})",
          "categorical([0, 1, 0, 2; 1, 2, 1, 2], [0, 1, 2, 3], {'abba', 'babba', 'cabba', 'dabba'})",
          "categorical({0, 1, 0, 2; 1, 2, 1, 2}, [0, 1, 2, 3], {'abba', 'babba', 'cabba', 'dabba'})",
          "categorical({0, 1, 0, 2; 1, 2, 1, 2}, [0, 1, 2, 3], {'abba', 'babba', 'cabba', 'dabba'}, 'Ordinal', 1)"
        ];

        var datas = [
          [
            [0, 1, 0, 2]
          ],
          [
            [0, 1, 0, 2]
          ],
          [
            [0, 1, 0, 2]
          ],
          [
            [0, 1, 0, 2]
          ],
          [
            [0, 1, 0, 2],
            [1, 2, 1, 2]
          ],
          [
            [0, 1, 0, 2],
            [1, 2, 1, 2]
          ],
          [
            [0, 1, 0, 2],
            [1, 2, 1, 2]
          ],
          [
            [0, 1, 0, 2],
            [1, 2, 1, 2]
          ]
        ];

        var values = [
          // new cali.calcu.mType.CellArray([[ [['a']], [['b']], [['c']] ]]),
          ['a', 'b', 'c'],
          ['ab', 'bb', 'cb'],
          ['ab', 'bb', 'cb', 'db'],
          ['ab', 'bb', 'cb', 'db'],
          ['ab', 'bb', 'cb', 'db'],
          [0, 1, 2, 3],
          [0, 1, 2, 3],
          [0, 1, 2, 3]
        ];

        var names = [
          // new cali.calcu.mType.CellArray([[ [['a']], [['b']], [['c']] ]]),
          ['a', 'b', 'c'],
          ['ab', 'bb', 'cb'],
          ['ab', 'bb', 'cb', 'db'],
          ['abba', 'babba', 'cabba', 'dabba'],
          ['abba', 'babba', 'cabba', 'dabba'],
          ['abba', 'babba', 'cabba', 'dabba'],
          ['abba', 'babba', 'cabba', 'dabba'],
          ['abba', 'babba', 'cabba', 'dabba']
        ];

        var ordinal = [
          [
            [0]
          ],
          [
            [0]
          ],
          [
            [0]
          ],
          [
            [0]
          ],
          [
            [0]
          ],
          [
            [0]
          ],
          [
            [0]
          ],
          [
            [1]
          ]
        ];

        var raw = [
          new CellArrayType([
            [
              [
                ['a']
              ],
              [
                ['b']
              ],
              [
                ['a']
              ],
              [
                ['c']
              ]
            ]
          ]),
          new CellArrayType([
            [
              [
                ['a', 'b']
              ],
              [
                ['b', 'b']
              ],
              [
                ['a', 'b']
              ],
              [
                ['c', 'b']
              ]
            ]
          ]),
          new CellArrayType([
            [
              [
                ['a', 'b']
              ],
              [
                ['b', 'b']
              ],
              [
                ['a', 'b']
              ],
              [
                ['c', 'b']
              ]
            ]
          ]),
          new CellArrayType([
            [
              [
                ['a', 'b']
              ],
              [
                ['b', 'b']
              ],
              [
                ['a', 'b']
              ],
              [
                ['c', 'b']
              ]
            ]
          ]),
          new CellArrayType([
            [
              [
                ['a', 'b']
              ],
              [
                ['b', 'b']
              ],
              [
                ['a', 'b']
              ],
              [
                ['c', 'b']
              ]
            ],
            [
              [
                ['b', 'b']
              ],
              [
                ['c', 'b']
              ],
              [
                ['b', 'b']
              ],
              [
                ['c', 'b']
              ]
            ]
          ]),
          [
            [0, 1, 0, 2],
            [1, 2, 1, 2]
          ],
          new CellArrayType([
            [
              [
                [0]
              ],
              [
                [1]
              ],
              [
                [0]
              ],
              [
                [2]
              ]
            ],
            [
              [
                [1]
              ],
              [
                [2]
              ],
              [
                [1]
              ],
              [
                [2]
              ]
            ]
          ]),
          new CellArrayType([
            [
              [
                [0]
              ],
              [
                [1]
              ],
              [
                [0]
              ],
              [
                [2]
              ]
            ],
            [
              [
                [1]
              ],
              [
                [2]
              ],
              [
                [1]
              ],
              [
                [2]
              ]
            ]
          ])
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].name).toEqual("ans");
            expect(ans[0].ans.type).toEqual("CATEGORICAL");
            expect(ans[0].ans.data).toEqual(datas[i]);
            expect(ans[0].ans.properties.values).toEqual(values[i]);
            expect(ans[0].ans.properties.names).toEqual(names[i]);
            expect(ans[0].ans.properties.raw).toEqual(raw[i]);
            expect(ans[0].ans.properties.Ordinal).toEqual(ordinal[i]);
          });
        }
      });

      it("should throw errors when appropriate", function () {
        var inputs = [
          "categorical()"
        ];

        var errors = [
          "Operator Error :: categorical :: Input missing."
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual(errors[i])
          });
        }
      });
    });
  });

});