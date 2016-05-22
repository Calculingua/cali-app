define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  describe("cali.calcu.interpreter.mNative.getColumn", function () {


    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("getColumn(obj, 'propName')", function () {

      beforeEach(function (done) {
        parser.evaluate("x = table([1; 2; 3], [4; 5; 6], {'too'; 'cool'; 'for'}, 'VariableNames', {'butts', 'heads', 'school'})", function (err, ans) {
          done();
        });
      });

      it("should return the specified property", function () {
        var inputs = [
          "getColumn(x, 'butts')",
          "getColumn(x, 'school')"
        ];

        var datas = [
          [
            [1],
            [2],
            [3]
          ],
          [
            [
              [
                ['t', 'o', 'o']
              ]
            ],
            [
              [
                ['c', 'o', 'o', 'l']
              ]
            ],
            [
              [
                ['f', 'o', 'r']
              ]
            ]
          ]
        ];

        var names = [
          'ans',
          'ans'
        ];

        for (var i = 0; i < inputs.length; i++) {
          console.log(inputs[i])
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].name).toEqual(names[i]);
            for (var k = 0; k < datas[i].length; k++) {
              expect(ans[0].ans[k]).toEqual(datas[i][k]);
            }

          });
        }
      });

      it("should error when column not found", function () {
        var inputs = [
          "getColumn(x, 'tails')"
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operator Error :: getColumn :: Column not found.");
            expect(ans.length).toEqual(0);
          });
        }
      });
    });
  });

});