define([
  "cali-calcu/interpreter/mStatic/Relational",
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function (Relational, $J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mStatic.Relational", function () {

    // setup the environment
    var epsilon = null; // how close the values should be
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    it("should exist in the namespace", function () {
      expect(typeof Relational).toEqual("function");
    });

    describe("`==`", function () {
      describe("is a test for equivilence", function () {
        describe("that in scalar-scalar case", function () {
          describe("returns `1` for equivilence", function () {
            it("should return `1` from `10 == 10`", function (done) {
              var exp = "10 == 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });
            });

            it("should return `1` from `-10 == -10`", function (done) {
              var exp = "-10 == -10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });

            it("should return `1` from `10*10 + 1 == 101`", function (done) {
              var exp = "10*10 + 1 == 101";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });
            });

            it("should return `1` from `101 == 10*10 + 1`", function (done) {
              var exp = "101 == 10*10 + 1";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `0` from `11 == 10`", function (done) {
              var exp = "11 == 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [0]
                ]);
                done();
              });

            });
          });
        });

        describe("that in matrix-matrix case", function () {
          describe("returns `1` for equivilence", function () {
            it("should return `[1, 1; 1, 1]` from `[10, 11; 12, 13] == [10, 11; 12, 13]`", function (done) {
              var exp = "[10, 11; 12, 13] == [10, 11; 12, 13]";
              var correct = [
                [1, 1],
                [1, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `[0, 1; 1, 0]` from `[12, 12; 12, 11] == [10, 11; 12, 13]`", function (done) {
              var exp = "[12, 12; 12, 11] == [10, 11; 12, 13]";
              var correct = [
                [0, 0],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("that in matched size matrix-scalar case", function () {
          describe("returns `1` for equivilence", function () {
            it("should return `[1, 1; 1, 1]` from `[10, 10; 10, 10] == 10`", function (done) {
              var exp = "[10, 10; 10, 10] == 10";
              var correct = [
                [1, 1],
                [1, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });

            it("should return `[1, 1; 1, 1]` from `10 == [10, 10; 10, 10]`", function (done) {
              var exp = "10 == [10, 10; 10, 10]";
              var correct = [
                [1, 1],
                [1, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });

            it("should return `[1, 1; 1, 1]` from `[10] == [10, 10; 10, 10]`", function (done) {
              var exp = "[10] == [10, 10; 10, 10]";
              var correct = [
                [1, 1],
                [1, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `[0, 0; 1, 0]` from `[11, 11; 10, 13] == 10`", function (done) {
              var exp = "[11, 11; 10, 13] == 10";
              var correct = [
                [0, 0],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });

            it("should return `[1, 1; 1, 0]` from `10 == [10, 10; 10, 13]`", function (done) {
              var exp = "10 == [10, 10; 10, 13]";
              var correct = [
                [1, 1],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });

            it("should return `[0, 1; 1, 0]` from `[10] == [11, 10; 10, 13]`", function (done) {
              var exp = "[10] == [11, 10; 10, 13]";
              var correct = [
                [0, 1],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("in other case", function () {
          describe("throws an error", function () {
            it("should throw an error from `[11, 11; 10, 13] == [10, 10]`", function (done) {

              var exp = "[11, 11; 10, 13] == [10, 10]";
              parser.evaluate(exp, function (err, ans) {
                expect(err).toEqual("Opperation Error : == : matrices have incorrect sizes.");
                done();
              });

            });

            it("should throw an error from `[10, 10] == [11, 11; 10, 13]`", function (done) {

              var exp = "[10, 10] == [11, 11; 10, 13]";
              parser.evaluate(exp, function (err, ans) {
                expect(err).toEqual("Opperation Error : == : matrices have incorrect sizes.");
                done();
              });

            });

            it("should throw an error from `[10; 10] == [11, 11; 10, 13]`", function (done) {
              var exp = "[10; 10] == [11, 11; 10, 13]";
              parser.evaluate(exp, function (err, ans) {
                expect(err).toEqual("Opperation Error : == : matrices have incorrect sizes.");
                done();
              });
            });

            it("should throw an error from `[11, 11, 12; 10, 13, 14] == [11, 11; 10, 13]`", function (done) {

              var exp = "[11, 11, 12; 10, 13, 14] == [11, 11; 10, 13]";
              parser.evaluate(exp, function (err, ans) {
                expect(err).toEqual("Opperation Error : == : matrices have incorrect sizes.");
                done();
              });

            });
          });
        });
      });
    });

    describe("`>`", function () {
      describe("is a test for greater than", function () {
        describe("that in scalar-scalar case", function () {
          describe("returns `1` for greater", function () {
            it("should return `1` from `11 > 10`", function (done) {
              var exp = "11 > 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `0` from `9 > 10`", function (done) {
              var exp = "9 > 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [0]
                ]);
                done();
              });

            });
          });
        });

        describe("that in matrix-matrix case", function () {
          describe("returns for each element", function () {
            it("should return `[1, 0; 1, 0]` from `[10, 11; 12, 13] > [9, 11; 9, 14]`", function (done) {
              var exp = "[10, 11; 12, 13] > [9, 11; 9, 14]";
              var correct = [
                [1, 0],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("that in matched size matrix-scalar case", function () {
          describe("returns for each element in matrix", function () {
            it("should return `[0, 1; 0, 1]` from `[10, 15; 10, 11] > 10`", function (done) {
              var exp = "[10, 15; 10, 11] > 10";
              var correct = [
                [0, 1],
                [0, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });
      });
    });

    describe("`>=`", function () {
      describe("is a test for greater than or equal", function () {
        describe("that in scalar-scalar case", function () {
          describe("returns `1` for greater than or equal", function () {
            it("should return `1` from `11 >=10`", function (done) {
              var exp = "11 >= 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });

            it("should return `1` from `10 >= 10`", function (done) {
              var exp = "10 >= 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `0` from `9 > 10`", function (done) {
              var exp = "9 > 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [0]
                ]);
                done();
              });

            });
          });
        });

        describe("that in matrix-matrix case", function () {
          describe("returns for each element", function () {
            it("should return `[1, 1; 1, 0]` from `[10, 11; 12, 13] >= [9, 11; 9, 14]`", function (done) {
              var exp = "[10, 11; 12, 13] >= [9, 11; 9, 14]";
              var correct = [
                [1, 1],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("that in matched size matrix-scalar case", function () {
          describe("returns for each element in matrix", function () {
            it("should return `[1, 1; 1, 1]` from `[10, 15; 10, 11] >= 10`", function (done) {
              var exp = "[10, 15; 10, 11] >= 10";
              var correct = [
                [1, 1],
                [1, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });
      });
    });

    describe("`<`", function () {
      describe("is a test for less than", function () {
        describe("that in scalar-scalar case", function () {
          describe("returns `1` for less", function () {
            it("should return `1` from `10 < 11`", function (done) {
              var exp = "10 < 11";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `0` from `10 < 9`", function (done) {
              var exp = "10 < 9";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [0]
                ]);
                done();
              });

            });
          });
        });

        describe("that in matrix-matrix case", function () {
          describe("returns for each element", function () {
            it("should return `[0, 0; 0, 1]` from `[10, 11; 12, 13] < [9, 11; 9, 14]`", function (done) {
              var exp = "[10, 11; 12, 13] < [9, 11; 9, 14]";
              var correct = [
                [0, 0],
                [0, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("that in matched size matrix-scalar case", function () {
          describe("returns for each element in matrix", function () {
            it("should return `[0, 1; 0, 0]` from `[10, 9; 10, 11] < 10`", function (done) {
              var exp = "[10, 9; 10, 11] < 10";
              var correct = [
                [0, 1],
                [0, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });
      });
    });

    describe("`<=`", function () {
      describe("is a test for less than or equal to", function () {
        describe("that in scalar-scalar case", function () {
          describe("returns `1` for less than or equal", function () {
            it("should return `1` from `10 <= 11`", function (done) {
              var exp = "10 <= 11";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });

            it("should return `1` from `10 <= 10`", function (done) {
              var exp = "10 <= 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `0` from `10 <= 9`", function (done) {
              var exp = "10 <= 9";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [0]
                ]);
                done();
              });

            });
          });
        });

        describe("that in matrix-matrix case", function () {
          describe("returns for each element", function () {
            it("should return `[0, 1; 0, 1]` from `[10, 11; 12, 13] <= [9, 11; 9, 14]`", function (done) {
              var exp = "[10, 11; 12, 13] <= [9, 11; 9, 14]";
              var correct = [
                [0, 1],
                [0, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("that in matched size matrix-scalar case", function () {
          describe("returns for each element in matrix", function () {
            it("should return `[1, 1; 1, 0]` from `[10, 9; 10, 11] <= 10`", function (done) {
              var exp = "[10, 9; 10, 11] <= 10";
              var correct = [
                [1, 1],
                [1, 0]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });
      });
    });

    describe("`~=`", function () {
      describe("is a test for not equal to", function () {
        describe("that in scalar-scalar case", function () {
          describe("returns `1` for not equal", function () {
            it("should return `1` from `10 ~= 11`", function (done) {
              var exp = "10 ~= 11";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });

            it("should return `1` from `12 ~= 10`", function (done) {
              var exp = "12 ~= 10";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [1]
                ]);
                done();
              });

            });
          });

          describe("returns `0` for not", function () {
            it("should return `0` from `9 ~= 9`", function (done) {
              var exp = "9 ~= 9";
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual([
                  [0]
                ]);
                done();
              });

            });
          });
        });

        describe("that in matrix-matrix case", function () {
          describe("returns for each element", function () {
            it("should return `[1, 0; 1, 1]` from `[10, 11; 12, 13] ~= [9, 11; 9, 14]`", function (done) {
              var exp = "[10, 11; 12, 13] ~= [9, 11; 9, 14]";
              var correct = [
                [1, 0],
                [1, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });

        describe("that in matched size matrix-scalar case", function () {
          describe("returns for each element in matrix", function () {
            it("should return `[0, 1; 0, 1]` from `[10, 9; 10, 11] ~= 10`", function (done) {
              var exp = "[10, 9; 10, 11] ~= 10";
              var correct = [
                [0, 1],
                [0, 1]
              ];
              parser.evaluate(exp, function (err, ans) {
                expect(ans[0].ans).toEqual(correct);
                done();
              });

            });
          });
        });
      });
    });
  });

});
