define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {

  $J.describe("cali.calcu.interpreter.mBasic.String", function () {

    var parser = null;
    beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    it("should return a a string", function (done) {
      var str = "'butts'";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("ans");
        expect(out[0].ans).toEqual([
          ['b', 'u', 't', 't', 's']
        ]);
        done()
      });

    });

    it("should return a a string when assigining to a variable", function (done) {
      var str = "x = 'butts'";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("x");
        expect(out[0].ans).toEqual([
          ['b', 'u', 't', 't', 's']
        ]);
        done()
      });

    });

    it("should return a matrix", function (done) {
      var str = "x = ['butts'; 'heads']";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("x");
        expect(out[0].ans).toEqual([
          ['b', 'u', 't', 't', 's'],
          ['h', 'e', 'a', 'd', 's']
        ]);
        done()
      });

    });

    it("should concatenate the string when placed in an array", function (done) {
      var str = "x = ['butts', 'heads']";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("x");
        expect(out[0].ans).toEqual([
          ['b', 'u', 't', 't', 's', 'h', 'e', 'a', 'd', 's']
        ]);
        done()
      });

    });

    it("should be okay with multiple transposes", function (done) {
      var str = "x = 1' * 2'";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        expect(out[0].name).toEqual("x");
        expect(out[0].ans).toEqual([
          [2]
        ]);
        done()
      });

    });

  });

});