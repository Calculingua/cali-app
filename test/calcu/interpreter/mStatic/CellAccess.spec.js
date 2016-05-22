define([
  "cali-calcu/interpreter/mStatic/CellAccess",
  "async",
  "$J",
  "cali-calcu/CommandParser"
], function (CellAccess, async, $J, CommandParser) {

  $J.describe("cali.calcu.interpreter.mStatic.CellAccess", function () {

    it("should exist", function () {
      expect(typeof CellAccess).toEqual("function");
    });

    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
    });

    describe("parser.preprocess", function () {

      it("should return the correct tokens", function () {
        var cmds = ["butts{1,1}", "butts{1:2,1:5}", "butts{ 1:2 , 1:5 }", "butts{ 1 : 2 , 1 : 5 }"];
        var toks = [
          ["butts{", "1", ",", "1", "}", "\n"],
          ["butts{", "1", ":", "2", ",", "1", ":", "5", "}", "\n"],
          ["butts{", "1", ":", "2", ",", "1", ":", "5", "}", "\n"],
          ["butts{", "1", ":", "2", ",", "1", ":", "5", "}", "\n"]
        ];
        for (var i = 0; i < cmds.length; i++) {
          var args = parser.preprocess(cmds[i]);
          for (var j = 0; j < args.length; j++) {
            expect(args[j].token).toEqual(toks[i][j]);
          }
        }
      });
    });

    describe("new CellAccess(input, position, parent, operators)", function () {

      it("should store the Cell Array name", function (done) {
        var cmds = ["butts{1,1}", "butts{1:2,1:5}", "butts{ 1:2 , 1:5 }", "butts{ 1 : 2 , 1 : 5 }", "butts{ 1 + 2 , 1 * 5 }", "butts{ 1 + 2 , end - 5 }"];
        var argTypes = [
          ["NUMBER", "NUMBER"],
          ["COLON", "COLON"],
          ["COLON", "COLON"],
          ["COLON", "COLON"],
          ["ADDITION", "MULTIPLICATION"],
          ["ADDITION", "SUBTRACTION"]
        ];
        var k = 0;
        async.eachSeries(cmds, function (cmd, cb) {
          var args = parser.preprocess(cmd);
          var exp = new CellAccess(args, 0, null, parser.operators);
          expect(exp.name).toEqual("butts");
          k++;
          cb(null);
        }, done);
      });

      it("should place the first and second arguments in `args`", function (done) {
        var cmds = ["butts{1,1}", "butts{1:2,1:5}", "butts{ 1:2 , 1:5 }", "butts{ 1 : 2 , 1 : 5 }", "butts{ 1 + 2 , 1 * 5 }", "butts{ 1 + 2 , end - 5 }"];
        var argTypes = [
          ["NUMBER", "NUMBER"],
          ["COLON", "COLON"],
          ["COLON", "COLON"],
          ["COLON", "COLON"],
          ["ADDITION", "MULTIPLICATION"],
          ["ADDITION", "SUBTRACTION"]
        ];
        var k = 0;
        async.eachSeries(cmds, function (cmd, cb) {
          var args = parser.preprocess(cmd);
          var exp = new CellAccess(args, 0, null, parser.operators);
          expect(exp.args[0].type).toEqual(argTypes[k][0]);
          expect(exp.args[1].type).toEqual(argTypes[k][1]);
          k++;
          cb(null);
        }, done);
      });

    });

    describe("#interpret(opts, callback)", function () {
      var cmds, exp, spy;

      beforeEach(function (done) {
        var seed = "butts = {1, [2; 3], {'four'; 'five'}, 6; [7, 8; 9, 10], 'eleven', ['twelve'; 'twe1ve'], 13};";
        parser.evaluate(seed, done);
      });

      it("should return a single variable", function (done) {
        cmds = ["butts{1,1}", "butts{2, 1}", "butts{ 2 , 3 }", "butts{ 1 + 1 , 1 }", "butts{2, end}", "butts{2, end - 1}", "butts{end, 4}"];
        var correct = [
          [
            [1]
          ],
          [
            [7, 8],
            [9, 10]
          ],
          [
            ['t', 'w', 'e', 'l', 'v', 'e'],
            ['t', 'w', 'e', '1', 'v', 'e']
          ],
          [
            [7, 8],
            [9, 10]
          ],
          [
            [13]
          ],
          [
            ['t', 'w', 'e', 'l', 'v', 'e'],
            ['t', 'w', 'e', '1', 'v', 'e']
          ],
          [
            [13]
          ]
        ];

        var k = 0;
        async.eachSeries(cmds, function (cmd, cb) {
          var args = parser.preprocess(cmd);
          var exp = new CellAccess(args, 0, null, parser.operators);
          exp.interpret(parser, function (err, ans) {
            expect(ans).toEqual(correct[k]);
            k++;
            cb(err);
          });
        }, function (err) {
          done();
        });
      });

      it("should return multiple variables", function (done) {
        cmds = ["butts{1:2,1}"]; //, "[x, y, z] = butts{2, 1:3}", "[x, y] = butts{ end , 3:4 }"];
        var correct = [
          [
            [
              [1]
            ],
            [
              [7, 8],
              [9, 10]
            ]
          ]
        ];

        var k = 0;
        async.eachSeries(cmds, function (cmd, cb) {
          var args = parser.preprocess(cmd);
          var exp = new CellAccess(args, 0, null, parser.operators);
          exp.interpret(parser, function (err, ans) {
            expect(arguments.length).toEqual(correct[k].length + 1);
            for (var j = 1; j < arguments.length; j++) {
              expect(arguments[j]).toEqual(correct[k][j - 1]);
            }
            k++;
            cb(err);
          });
        }, function (err) {
          done();
        });
      });
    });

    describe("parser.evaluate", function () {

      beforeEach(function (done) {
        var seed = "butts = {1, [2; 3], {'four'; 'five'}, 6; [7, 8; 9, 10], 'eleven', ['twelve'; 'twe1ve'], 13};\n heads = [1, 2; 3, 4];";
        parser.evaluate(seed, done);
      });

      it("should return the correct answer", function (done) {
        cmds = ["x = butts{1,1}"];
        var correct = [
          {
            name: "x",
            ans: [
              [1]
            ]
          }
        ];

        var k = 0;
        async.eachSeries(cmds, function (cmd, cb) {
          parser.evaluate(cmd, function (err, ans) {
            expect(parser.variables[correct[k].name]).toEqual(correct[k].ans);
            k++;
            cb(err);
          })
        }, function (err) {
          done();
        });
      });

      it("should allow setting the value of an array entry", function (done) {
        cmds = ["butts{1,1} = 2"];
        var correct = [
          {
            name: "butts",
            ans: [
              [
                [
                  [2]
                ],
                [
                  [2],
                  [3]
                ],
                [
                  [
                    [
                      ['f', 'o', 'u', 'r']
                    ]
                  ],
                  [
                    [
                      ['f', 'i', 'v', 'e']
                    ]
                  ]
                ],
                [
                  [6]
                ]
              ],
              [
                [
                  [7, 8],
                  [9, 10]
                ],
                [
                  ['e', 'l', 'e', 'v', 'e', 'n']
                ],
                [
                  ['t', 'w', 'e', 'l', 'v', 'e'],
                  ['t', 'w', 'e', '1', 'v', 'e']
                ],
                [
                  [13]
                ]
              ]
            ]
          }
        ];

        var k = 0;
        async.eachSeries(cmds, function (cmd, cb) {
          parser.evaluate(cmd, function (err, ans) {

            for (var i = 0; i < correct[k].ans.length; i++) {
              expect(parser.variables[correct[k].name][i]).toEqual(correct[k].ans[i]);
            }
            k++;
            cb(err);
          });
        }, function (err) {
          done();
        });
      });

      it("should error if used to access a `matrix` variable", function (done) {
        var cmd = "y = heads{1,1};";
        parser.evaluate(cmd, function (err, ans) {
          // expect(err).toExist();
          expect(err.toString()).toEqual("Input Error with :: MATRIX :: attempt to access as a CELL_ARRAY");
          // expect(parser.variables.length).toEqual(2);
          done();
        })
      });

      it("should error if used to set a `matrix` variable", function (done) {
        var cmd = "heads{1,1} = 4;";
        parser.evaluate(cmd, function (err, ans) {
          // expect(err).toExist();
          expect(err.toString()).toEqual("Input Error with :: MATRIX :: attempt to access as a CELL_ARRAY");
          // expect(parser.variables.length).toEqual(2);
          done();
        })
      });
    });
  });

});