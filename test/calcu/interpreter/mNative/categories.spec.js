define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mNative.categories", function () {


    // setup the environment
    var parser = null; // the parser
    beforeEach(function () {
      parser = new CommandParser();
      // this gives the toBeMatrixCloseTo function
      $J.jasmine.Expectation.addMatchers(Matchers);
      epsilon = 1e-9;
    });

    describe("categories(obj)", function () {

      it("should return the categories", function () {

        var setup = [
          "x = categorical({'a', 'b', 'a', 'c'})",
          "x = categorical({'ab', 'bb', 'ab', 'cb'})",
          "x = categorical([1, 2, 1, 2])"
        ];
        var inputs = [
          "categories(x)",
          "categories(x)",
          "categories(x)"
        ];

        var datas = [
          [
            [
              [
                ['a']
              ],
              [
                ['b']
              ],
              [
                ['c']
              ]
            ]
          ],
          [
            [
              [
                ['a', 'b']
              ],
              [
                ['b', 'b']
              ],
              [
                ['c', 'b']
              ]
            ]
          ] ,
          [
            [
              [
                [1]
              ],
              [
                [2]
              ]
            ]
          ]
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(setup[i], function () {
            parser.evaluate(inputs[i], function (err, ans) {
              expect(err).toBeFalsy();
              for (var k = 0; k < datas[i].length; k++) {
                expect(ans[0].ans[k]).toEqual(datas[i][k]);
              }

            });
          });
        }
      });

      it("should return the categories", function () {

        var setup = [
          "x = [1, 2, 3]",
          "x = [1, 2, 3]"
        ]
        var inputs = [
          "categories(x)",
          "categories(y)"
        ];

        var errors = [
          "Operator Error :: categories :: Variable does not have any categories.",
          "Exception with variable 'y', variable not initialized."
        ];

        for (var i = 0; i < inputs.length; i++) {
          parser.evaluate(setup[i], function () {
            parser.evaluate(inputs[i], function (err, ans) {
              expect(err.toString()).toEqual(errors[i]);

            });
          });
        }
      });
    });
  });

});