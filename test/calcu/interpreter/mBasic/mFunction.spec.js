define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser",
  "async"
], function ($J,Matchers, CommandParser, async) {

  $J.describe("mFunction", function () {

    describe("A test of identifying a function", function () {

      // setup the environment
      var parser = null;
      beforeEach(function () {
        parser = new CommandParser();
        $J.jasmine.Expectation.addMatchers(Matchers);
      });

      it("should correctly identify the function tokens", function () {

        var str = "x = test();";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test(");
        expect(out[3].token).toEqual(")");

      });

      it("should correctly identify the function tokens with w/s", function () {

        var str = "x = test ();";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test (");
        expect(out[3].token).toEqual(")");

      });

      it("should correctly identify the function tokens with other w/s", function () {

        var str = "x = 3 + test ( ) - 2;";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[4].token).toEqual("test (");
        expect(out[5].token).toEqual(")");

      });

      it("should correctly identify the function tokens with 1 arg", function () {

        var str = "x = test (4);";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test (");
        expect(out[3].token).toEqual("4");
        expect(out[4].token).toEqual(")");

      });

      it("should correctly identify the tokens with 1 arg and w/s", function () {

        var str = "x = test ( 4 );";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test (");
        expect(out[3].token).toEqual("4");
        expect(out[4].token).toEqual(")");

      });

      it("should correctly identify the tokens with 2 arg and w/s", function () {

        var str = "x = test ( 4 , 5 );";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test (");
        expect(out[3].token).toEqual("4");
        expect(out[4].token).toEqual(",");
        expect(out[5].token).toEqual("5");
        expect(out[6].token).toEqual(")");

      });

      it("should correctly identify the tokens with variable arg", function () {

        var str = "x = test(x);";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test(");
        expect(out[3].token).toEqual("x");
        expect(out[4].token).toEqual(")");

      });

      it("should correctly identify the tokens with multiple variable args", function () {

        var str = "x = test(x,test123);";
        var out = parser.tokenize(str);
        console.debug("input : " + str);
        console.debug("out : ");
        console.debug(out);

        expect(out[2].token).toEqual("test(");
        expect(out[3].token).toEqual("x");
        expect(out[4].token).toEqual(",");
        expect(out[5].token).toEqual("test123");
        expect(out[6].token).toEqual(")");

      });
    });

    describe("A unit test for the argument parsing", function () {

      // setup the environment
      var parser = null;
      var input = null;
      beforeEach(function () {
        parser = new CommandParser();
      });

      it("should seperate comma seperated arguments correctly : `x = test(2, 3);`", function () {
        input = "x = test(2, 3);"
        console.debug("input : " + input);
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);

        expect(exp).toBeTruthy();
        expect(exp.operator).toEqual("test");
        expect(exp.funcArgs.length).toEqual(2);
      });

      it("should seperate comma seperated arguments correctly : `x = test(2, 3, 4);`", function () {
        input = "x = test(2, 3, 4);";
        console.debug("input : " + input);
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);

        expect(exp).toBeTruthy();
        expect(exp.operator).toEqual("test");
        expect(exp.funcArgs.length).toEqual(3);
      });

      it("should seperate comma seperated expressions correctly : `x = test((2 + 2*4), (3*2), [2, 3]);`", function () {
        input = "x =  test((2 + 2*4), (3*2), [2, 3]);";
        console.debug("input : " + input);
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);

        expect(exp).toBeTruthy();
        expect(exp.operator).toEqual("test");
        expect(exp.funcArgs.length).toEqual(3);
      });

      it("should seperate comma seperated expressions correctly : `x = test(test1(3, 4), 3, 4);`", function () {
        input = "x = test(test1(3, 4), 3, 4);";
        console.debug("input : " + input);
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);

        expect(exp).toBeTruthy();
        expect(exp.operator).toEqual("test");
        expect(exp.funcArgs.length).toEqual(3);
      });

      it("should seperate comma seperated expressions correctly : `x = test(3 + 4, 3, 4);`", function () {
        input = "x = test(3 + 4, 3, 4);";
        console.debug("input : " + input);
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);

        expect(exp).toBeTruthy();
        expect(exp.operator).toEqual("test");
        expect(exp.funcArgs.length).toEqual(3);
      });

      it("should seperate comma seperated expressions correctly : `x = test(2 * 3 - 4, 3 + 2, 4*3);`", function () {
        input = "x = test(2 * 3 - 4, 3 + 2, 4*3);";
        console.debug("input : " + input);
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);

        expect(exp).toBeTruthy();
        expect(exp.operator).toEqual("test");
        expect(exp.funcArgs.length).toEqual(3);
      });

    });


    describe("a unit test for dynamic function creation", function () {
      // setup the environment
      var parser = null;
      var input = null;
      beforeEach(function () {
        parser = new CommandParser();
      });

      it("should allow for single function insertion", function () {
        function test(x, y, callback) {
          callback(null, [
            [0]
          ]);
        }

        test.async = true;

        parser.operators.addFunction("test", test);

        expect(parser.operators.funcList["test"]).toBeDefined();
        //expect(parser.operators.funcList["test"](3, 4)).toEqual([ [ 0 ] ]);
      });

      it("should allow for multiple function insertions", function () {
        function test(x, y, callback) {
          callback(null, [
            [0]
          ]);
        }

        test.async = true;

        function test2(x, y, callback) {
          callback(null, [
            [2]
          ]);
        }

        test2.async = true;

        parser.operators.addFunction("test", test);
        parser.operators.addFunction("test2", test2);

        expect(parser.operators.funcList["test"]).toBeDefined();
        //expect(parser.operators.funcList["test"](3, 4)).toEqual([ [ 0 ] ]);
        expect(parser.operators.funcList["test2"]).toBeDefined();
        //expect(parser.operators.funcList["test2"](3, 4)).toEqual([ [ 2 ] ]);
      });

      it("should allow for function retrival", function (done) {
        function test(x, y) {
          return [
            [0]
          ];
        }

        test.async = true;

        parser.operators.addFunction("test", test);

        parser.operators.getFunction("test", function (err, func) {
          expect(func).toBeDefined();
          done();
        })
      });

      it("should return null for unknown function retrival", function (done) {
        function test(x, y, callback) {
          callback(null[[0]]);
        }

        test.async = true;

        parser.operators.addFunction("test", test);

        parser.operators.getFunction("test1", function (err, func) {
          expect(func).not.toBeDefined();
          done();
        })
      });
    });

    describe("a unit test for function evaluation", function () {

      // setup the environment
      var parser = null;
      var input = null;
      beforeEach(function () {
        parser = new CommandParser();

        function test(x, y, callback) {
          var out = x;
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].length; j++) {
              out[i][j] += y[i][j];
            }
          }
          callback(null, out);
        }

        test.async = true;

        parser.operators.addFunction("test", test);
      });

      it("should evaluate the function when interpreting", function () {

        var input = "x = test(3, 4);";
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        // create the expression
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);
        // evaluate the arguments
        var opts = {
          variables: {}
        };
        exp.interpret(opts, function (err, out) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(out);

          expect(out).toEqual([
            [7]
          ]);
        });


      });

      it("should throw an exception when interpreting an unknown func", function () {
        var input = "x = test2(3, 4);";
        var cmd = parser.tokenize(input);
        // make a fake parent
        var parent = {
          args: [],
          parent: {}
        };
        // create the expression
        var exp = new parser.operators.func.expression(cmd, 2, parent, parser.operators);
        // evaluate the arguments
        var opts = {
          variables: {}
        };
        console.debug("input : " + input);

        exp.interpret(opts, function (err, out) {
          expect(err).toEqual("Exception with FUNCTION: unknown token.");
        });

      });

    });

    describe("integration testing for the mFunction", function () {

      // setup the environment
      var parser = null;
      var input = null;
      beforeEach(function () {
        parser = new CommandParser();

        function test(x, y, callback) {
          var out = x;
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].length; j++) {
              out[i][j] += y[i][j];
            }
          }
          callback(null, out);
        }

        test.async = true;

        parser.operators.addFunction("test", test);
      });

      it("operator should correctly find the mfuction", function () {
        var input = "test(";
        var opp = parser.operators.get({
          token: input
        });
        expect(opp.regexp).toEqual(/^([A-z_][\w.]*)(\s*)\(/);

      });

      it("should evaluate the function normally : `x = test(3, 4);`", function () {
        var input = "x = test(3, 4);";
        var correct = [
          [7]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });

      it("should evaluate the function normally : `x = test(3, 4) + 8;`", function () {
        var input = "x = test(3, 4) + 8;";
        var correct = [
          [15]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });

      it("should evaluate the function normally : `x = 5*test(3, 4) + 8;`", function () {
        var input = "x = 5*test(3, 4) + 8;";
        var correct = [
          [43]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });

      it("should evaluate the function normally : `x = 5*(test(3, 4) + 8);`", function () {
        var input = "x = 5*(test(3, 4) + 8);";
        var correct = [
          [75]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });

      it("should evaluate the function normally : `x = 5*(test(3 - 1, 4) + 8);`", function () {
        var input = "x = 5*(test(3 - 1, 4) + 8);";
        var correct = [
          [70]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });

      it("should evaluate the function normally : `x = 5*(test(3 - 1, 4 + 2) + 8);`", function () {
        var input = "x = 5*(test(3 - 1, 4 + 2) + 8);";
        var correct = [
          [80]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });

      it("should evaluate the function normally : `x = 5*(test(3 - 3 * (1 + 3), 4 + 2) + 8);`", function () {
        var input = "x = 5*(test(3 - 3 * (1 + 3), 4 + 2) + 8);";
        var correct = [
          [25]
        ];
        parser.evaluate(input, function (err, ans) {
          console.debug("input : " + input);
          console.debug("output : ");
          console.debug(ans[0].ans);

          expect(ans[0].ans).toEqual(correct);
        });
      });
    });

    describe("A suite for testing getting variable sub-matrices", function () {

      // setup the environment
      var parser = null;
      beforeEach(function () {
        parser = new CommandParser();

        function test(x, y, callback) {
          var out = x;
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].length; j++) {
              out[i][j] += y[i][j];
            }
          }
          callback(null, out);
        }

        test.async = true;

        parser.operators.addFunction("test", test);
      });

      it("should get the single number from the matrix : x = [3, 4; 5, 6]; y = x(2, 1);", function () {

        var pre = "x = [3, 4; 5, 6];";
        parser.evaluate(pre, function (err, ansPre) {
          var input = "y = x(2, 1);";
          var correct = [
            [5]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
          });
        });
      });

      it("should have variables trump functions : test = [3, 4; 5, 6]; y = test(2, 1);", function (done) {

        var pre = "test = [3, 4; 5, 6];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(2, 1);";
          var correct = [
            [5]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      it("should return 3 columns : test = [3, 4, 5, 6, 7]; y = test(1, 2:4);", function (done) {
        var pre = "test = [3, 4, 5, 6, 7];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(1, 2:4);";
          var correct = [
            [4, 5, 6]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      it("should return 3 columns : test = [3; 4; 5; 6; 7]; y = test(2:4, 1);", function (done) {
        var pre = "test = [3; 4; 5; 6; 7];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(2:4, 1);";
          var correct = [
            [4],
            [5],
            [6]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      it("should return 3 rows and 2 columns : test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16]; y = test(2:4, [2,3]);", function (done) {
        var pre = "test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(2:4, [2,3]);";
          var correct = [
            [6, 7],
            [10, 11],
            [14, 15]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });




      it("should work with the end operator : test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16]; y = test(3:end, 1);", function (done) {
        var pre = "test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = " y = test(3:end, 1);";
          var correct = [
            [9],
            [13]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      it("should work with the end operator : test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16]; y = test(1, 3:end);", function (done) {
        var pre = "test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(1, 3:end);";
          var correct = [
            [3, 4]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      it("should work with just a colon : test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16]; y = test(1, :);", function (done) {
        var pre = "test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(1, :);";
          var correct = [
            [1, 2, 3, 4]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      it("should work with just a colon : test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16]; y = test(:, 1);", function (done) {
        var pre = "test = [1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16];";
        parser.evaluate(pre, function (err, ansPre) {

          var input = "y = test(:, 1);";
          var correct = [
            [1],
            [5],
            [9],
            [13]
          ];
          parser.evaluate(input, function (err, ans) {
            console.debug("input : " + input);
            console.debug("output : ");
            console.debug(ans[0].ans);

            expect(ans[0].ans).toEqual(correct);
            done();
          });
        });
      });

      describe("that works with Cell Arrays", function () {

        it("should evaluate correctly", function (done) {
          var cmds = ["test = {1, 2, 3};\n out = test(1,1);",
            "test = {1, 2, 3};\n out = test(1,3);",
            "test = {1, 2, 3};\n out = test(1, 1:2);",
            "test = {1, 2, 'butts'};\n out = test(1, 2:3);",
            "test = {1, 2, {'butts', 'head'}};\n out = test(1, 2:3);"
          ];
          var correct = [
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
                  [3]
                ]
              ]
            ],
            [
              [
                [
                  [1]
                ],
                [
                  [2]
                ]
              ]
            ],
            [
              [
                [
                  [2]
                ],
                [
                  ['b', 'u', 't', 't', 's']
                ]
              ]
            ],
            [
              [
                [
                  [2]
                ],
                [
                  [

                    [
                      ['b', 'u', 't', 't', 's']

                    ],

                    [
                      ['h', 'e', 'a', 'd']

                    ]
                  ]
                ]
              ]
            ]
          ];
          var k = 0;

          async.eachSeries(cmds, function (cmd, callback) {
            parser.evaluate(cmd, function (err, ans) {
              for (var i in correct[k]) {
                for (var j in correct[k][i]) {
                  expect(ans[ans.length - 1].ans[i][j]).toEqual(correct[k][i][j]);
                }
              }
              // expect(ans[ans.length - 1].ans).toEqual(correct[k]);
              expect(ans[ans.length - 1].ans.type).toEqual("CELL_ARRAY");
              k++;
              console.debug("input : " + cmd);
              console.debug("output : ");
              console.debug(ans);
              callback(err);
            });
          }, done);
        });
      });

    });

  });


});