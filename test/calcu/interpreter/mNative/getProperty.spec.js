define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mNative.getProperty", function () {


    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("getProperty(obj, 'propName')", function () {

      beforeEach(function (done) {
        parser.evaluate("x = table([1; 2; 3], [4; 5; 6], {'too'; 'cool'; 'for'}, 'VariableNames', {'butts', 'heads', 'school'})", function (err, ans) {
          done();
        });
      });

      it("should return existing properties", function () {
        var inputs = [
          "getProperty(x, 'VariableNames')"
        ];

        var datas = [
          [
            [
              [
                ['b', 'u', 't', 't', 's']
              ],
              [
                ['h', 'e', 'a', 'd', 's']
              ],
              [
                ['s', 'c', 'h', 'o', 'o', 'l']
              ]
            ]
          ]
        ];

        var names = [
          'ans'
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toBeFalsy();
            expect(ans[0].name).toEqual(names[i]);
            for (var k = 0; k < datas[i].length; k++) {
              expect(ans[0].ans[k]).toEqual(datas[i][k]);
            }

          });
        }
      });

      it("should error when the property is not found", function () {
        var inputs = [
          "getProperty(x, 'butts')"
        ];


        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(inputs[i], function (err, ans) {
            expect(err).toEqual("Operator Error :: getProperty :: Unknown property.");
            expect(ans.length).toEqual(0);
          });
        }
      });
    });
  });

});