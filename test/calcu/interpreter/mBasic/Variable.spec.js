define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("A suite for testing the variable functionality", function () {

    var parser = null;
    $J.beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    it("should return setting `ans` to the number value `3.14`", function (done) {
      var str = "3.24";
      var ans = [
        [ 3.24 ]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("ans");
        expect(out[0].ans).toEqual(ans);
        expect(parser.getVariables()["ans"]).toEqual(ans);
        done();
      });

    });

    it("should return setting `ans` to the number value `-3.14`", function (done) {
      var str = "-3.24";
      var ans = [
        [ -3.24 ]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("ans");
        expect(out[0].ans).toEqual(ans);
        expect(parser.getVariables()["ans"]).toEqual(ans);
        done();
      });

    });

    it("should return setting `testVar` to the number value `-3.14`", function (done) {
      var str = "testVar = -3.24";
      var ans = [
        [ -3.24 ]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("testVar");
        expect(out[0].ans).toEqual(ans);
        expect(parser.getVariables()["testVar"]).toEqual(ans);
        done();
      });

    });

    it("should return setting `testVar1` to the number value `-3.14`", function (done) {
      var str = "testVar1 = -3.24";
      var ans = [
        [ -3.24 ]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("testVar1");
        expect(out[0].ans).toEqual(ans);
        expect(parser.getVariables()["testVar1"]).toEqual(ans);
        done();
      });

    });

    it("should return setting `testVar_12345` to the identify matrix", function (done) {
      var str = "testVar_12345 = [1 0; 0, 1]";
      var ans = [
        [ 1, 0 ],
        [0, 1]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("testVar_12345");
        expect(out[0].ans).toEqual(ans);
        expect(parser.getVariables()["testVar_12345"]).toEqual(ans);
        done();
      });

    });

    it("should allow setting `testVar1` to `testVar0`", function (done) {
      var str = "testVar0 = [1 0; 0, 1]";
      var str2 = "testVar1 = testVar0";
      var ans = [
        [ 1, 0 ],
        [0, 1]
      ];
      parser.evaluate(str, function (err, out) {
        parser.evaluate(str2, function (err, out2) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);
          console.debug("input : " + str2);
          console.debug("output : ");
          console.debug(out2[0].ans);
          expect(out2[0].name).toEqual("testVar1");
          expect(out2[0].ans).toEqual(ans);
          done();
        });

      });
    });

    describe("when there is a Table object", function () {
      beforeEach(function () {
        parser.evaluate("x = table([1; 2; 3], [4; 5; 6])", function () {

        });
      });

      it("should return existing column", function () {
        parser.evaluate("x.Var1", function (err, ans) {
          expect(err).toBeFalsy();
          expect(ans[0].name).toEqual("ans");
          expect(ans[0].ans).toEqual([
            [1],
            [2],
            [3]
          ]);
        });
      });

      it("should return an existing property ", function () {
        parser.evaluate("x.Properties.VariableNames", function (err, ans) {
          expect(err).toBeFalsy();
          expect(ans[0].name).toEqual("ans");
          expect(ans[0].ans[0][0]).toEqual([
            ['V', 'a', 'r', '1']
          ]);
          expect(ans[0].ans[0][1]).toEqual([
            ['V', 'a', 'r', '2']
          ]);
        });
      });

      it("should error when the property is not found ", function () {
        parser.evaluate("x.Properties.VariableName", function (err, ans) {
          expect(err).toEqual("Operator Error :: getProperty :: Unknown property.");
          expect(ans.length).toEqual(0);
        });

        parser.evaluate("x.Var3", function (err, ans) {
          expect(err).toEqual("Operator Error :: getColumn :: Column not found.");
          expect(ans.length).toEqual(0);
        });
      });

      it("should set the property", function () {
        parser.evaluate("x.Var1 = [10; 11; 12]", function (err, ans) {
          expect(err).toBeFalsy();
        });

        parser.evaluate("x.Var1", function (err, ans) {
          expect(err).toBeFalsy();
          expect(ans[0].ans).toEqual([
            [10],
            [11],
            [12]
          ]);
        });
      });
    });
        describe("when there is a Hash Table object", function () {
            beforeEach(function (done) {
                parser.evaluate("[h, p, ci, stats] = ttest(normrnd(25, .1, 100, 1))", done);
            });

            it("it should allow access the properties", function () {
                var inputs = [
                    "stats.df",
                    "stats.df(1,1)"
                ];
                
                var outputs = [
                    [[99]],
                    [[99]],
                ];
                for(var i = 0; i < inputs.length; i++){
                    parser.evaluate(inputs[i], function (err, ans) {
                        expect(err).toBeFalsy();
                        expect(ans[0].name).toEqual("ans");
                        expect(ans[0].ans).toEqual(outputs[i]);
                    });
                }
            });
        });
  });

});