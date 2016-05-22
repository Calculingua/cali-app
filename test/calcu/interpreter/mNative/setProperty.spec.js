define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mNative.setColumn", function () {

    describe("cali.calcu.interpreter.mNative.setProperty", function () {


      // setup the environment
      var parser = null; // the parser
      beforeEach(function () {
        parser = new CommandParser();
        // this gives the toBeMatrixCloseTo function
        $J.jasmine.Expectation.addMatchers(Matchers);
        epsilon = 1e-9;
      });

      describe("setProperty(obj, 'propName')", function () {

        beforeEach(function (done) {
          parser.evaluate("x = table([1; 2; 3], [4; 5; 6], {'too'; 'cool'; 'for'}, 'VariableNames', {'butts', 'heads', 'school'})", function (err, ans) {
            done();
          });
        });

        it("should return the specified property", function () {
          var inputs = [
            "setProperty(x, 'VariableNames', {'heads', 'butts', 'school'})",
            "setProperty(x, 'RowNames', {'xxx1', 'xxx2'})",
          ];

          var tests = [
            "getProperty(x, 'VariableNames')",
            "getProperty(x, 'RowNames')",
          ];

          var datas = [
            [
              [
                [
                  ['h', 'e', 'a', 'd', 's']
                ],
                [
                  ['b', 'u', 't', 't', 's']
                ],
                [
                  ['s', 'c', 'h', 'o', 'o', 'l']
                ]
              ]
            ],
            [
              [
                [
                  ['x', 'x', 'x', '1']
                ],
                [
                  ['x', 'x', 'x', '2']
                ]
              ]
            ],
          ];


          for (var i = 0; i < inputs.length; i++) {
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
      });
    });
  });
  });