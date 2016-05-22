define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mBasic.Number", function () {

    var parser = null;
    $J.beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    $J.it("should return a whole positive number", function (done) {
      var str = "3";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].name).toEqual("ans");
        $J.expect(out[0].ans).toEqual([
          [3]
        ]);
        done();
      });

    });
    $J.it("should return a whole negative number", function (done) {
      var str = "-3";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].name).toEqual("ans");
        $J.expect(out[0].ans).toEqual([
          [-3]
        ]);
        done()
      });

    });
    $J.it("should return a decemil positive number", function (done) {
      var str = "3.1415";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].name).toEqual("ans");
        $J.expect(out[0].ans).toEqual([
          [3.1415]
        ]);
        done()
      });

    });
    $J.it("should return a decemil negative number", function (done) {
      var str = "-3.1415";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].name).toEqual("ans");
        $J.expect(out[0].ans).toEqual([
          [-3.1415]
        ]);
        done()
      });

    });
    $J.it("should remove whitespace and return a number", function (done) {
      var str = "    3.1415    ";
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].name).toEqual("ans");
        $J.expect(out[0].ans).toEqual([
          [3.1415]
        ]);
        done()
      });

    });


  });

});