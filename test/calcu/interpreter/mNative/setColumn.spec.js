define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mNative.setColumn", function () {


    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    $J.describe("setColumn(obj, 'colName', colVal)", function () {

      beforeEach(function (done) {
        parser.evaluate("x = table([1; 2; 3], [4; 5; 6], {'too'; 'cool'; 'for'}, 'VariableNames', {'butts', 'heads', 'school'})", function (err, ans) {
          done();
        });
      });

      it("should update the specified column", function () {
        var inputs = [
          "setColumn(x, 'butts', {'heads'; 'butts'; 'school'})",
          "setColumn(x, 'tails', [99; 100; 101])"
        ];

        var tests = [
          "getColumn(x, 'butts')",
          "getColumn(x, 'tails')"
        ];

        var datas = [
          [
            [
              [
                ['h', 'e', 'a', 'd', 's']
              ]
            ],
            [
              [
                ['b', 'u', 't', 't', 's']
              ]
            ],
            [
              [
                ['s', 'c', 'h', 'o', 'o', 'l']
              ]
            ]
          ],
          [
            [99],
            [100],
            [101]
          ]
        ];


        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans.length).toEqual(0);
            parser.evaluate(tests[i], function (err, ans) {
              for (var k = 0; k < ans.length; k++) {
                expect(ans[0].ans[k]).toEqual(datas[i][k]);
              }
            })
          });
        }
      });

      it("should throw an error if the data is the wrong number of rows", function () {
        var inputs = [
          "setColumn(x, 'butts', {'heads', 'butts', 'school', 'tails'})",
          "setColumn(x, 'tails', [99; 100])"
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operator Error :: setColumn :: Input variable has the wrong number of rows.");
            expect(ans.length).toEqual(0);
          });
        }
      });
    });
  });

});