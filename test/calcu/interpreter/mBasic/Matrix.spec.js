define([
  "$J",
  "../../dev/Matchers",
  "cali-calcu/CommandParser"
], function ($J, Matchers, CommandParser) {


  $J.describe("cali.calcu.interpreter.mBasic.Matrix", function () {

    // setup the environment
    var parser = null;
    $J.beforeEach(function () {
      parser = new CommandParser();
      $J.jasmine.Expectation.addMatchers(Matchers);
    });

    $J.it("should return a 1x2 matrix of whole positive numbers", function (done) {

      var str = "[3, 4]";
      var correct = [
        [3, 4]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);

        $J.expect(out[0].ans).toEqual(correct);
        done();
      });
    });

    $J.it("should return a 2x2 matrix of whole positive numbers", function (done) {

      var str = "[3, 4; 5, 6]";
      var correct = [
        [3, 4],
        [5, 6]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].ans).toEqual(correct);
        done();
      });
    });

    $J.it("should return a 2x2 matrix of decmil positive numbers", function (done) {

      var str = "[3.1, 4.5767; 5.0009, 6.1111109]";
      var correct = [
        [3.1, 4.5767],
        [5.0009, 6.1111109]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);
        $J.expect(out[0].ans).toEqual(correct);
        done();
      });
    });

    $J.it("should still work with a missing comma", function (done) {

      var str = "[3.1 4.5767; 5.0009, 6.1111109]";
      var correct = [
        [3.1, 4.5767],
        [5.0009, 6.1111109]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].ans).toEqual(correct);
        done();
      });
    });

    $J.it("should work with negative numbers", function (done) {

      var str = "[3.1 -4.5767; 5.0009, 6.1111109]";
      var correct = [
        [3.1, -4.5767],
        [5.0009, 6.1111109]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].ans).toEqual(correct);
        done();
      });
    });

    $J.it("should work with a positive numbers", function (done) {

      var str = "[-3.1 +4.5767; 5.0009, +6.1111109]";
      var correct = [
        [-3.1, 4.5767],
        [5.0009, 6.1111109]
      ];
      parser.evaluate(str, function (err, out) {
        console.debug("input : " + str);
        console.debug("output : ");
        console.debug(out[0].ans);

        $J.expect(out[0].ans).toEqual(correct);
        done();
      });
    });

    $J.it("should return Exceptions with a multiplicaiton numbers", function (done) {

      var str = "[-3.1 *4.5767; 5.0009, +6.1111109]";
      console.debug("input : " + str);

      parser.evaluate(str, function (err, oud) {
        $J.expect(err.toString()).toEqual("Operator Error :: MULTIPLICATION : missing argument.");
        done();
      });

    });

    $J.describe("A sub-suite for testing putting together matrix with matrix", function () {

      $J.beforeEach(function () {
        parser = new CommandParser();
      });

      $J.it("should return a 2x2 matrix : `[[2; 3], [4; 5]]`", function (done) {
        var str = "[[2; 3], [4; 5]]";
        var correct = [
          [2, 4],
          [3, 5]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return a 2x3 matrix : `[[2, 6; 3, 7], [4; 5]]`", function (done) {
        var str = "[[2, 6; 3, 7], [4; 5]]";
        var correct = [
          [2, 6, 4],
          [3, 7, 5]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return a 3x3 matrix : `[[0, 1], [10]; [2, 6; 3, 7], [4; 5]]`", function (done) {
        var str = "[[0, 1], [10]; [2, 6; 3, 7], [4; 5]]";
        var correct = [
          [0, 1, 10],
          [2, 6, 4],
          [3, 7, 5]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return a 3x3 matrix : `[[0, 1], [10], [11, 12]; [2, 6; 3, 7], [4; 5], [15, 16; 17, 18]`", function (done) {
        var str = "[[0, 1], [10], [11, 12]; [2, 6; 3, 7], [4; 5], [15, 16; 17, 18]]";
        var correct = [
          [0, 1, 10, 11, 12],
          [2, 6, 4, 15, 16],
          [3, 7, 5, 17, 18]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return a 3x3 matrix : `[[0], [1, 10]; [2, 6; 3, 7], [4; 5]]`", function (done) {
        var str = "[[0], [1, 10]; [2, 6; 3, 7], [4; 5]]";
        var correct = [
          [0, 1, 10],
          [2, 6, 4],
          [3, 7, 5]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return a 3x3 matrix : `[[0], [1, 10]; [2, 6; 3, 7], [4; 5]]`", function (done) {
        var str = "[[0], [1, 10]; [2, 6; 3, 7], [4; 5]]";
        var correct = [
          [0, 1, 10],
          [2, 6, 4],
          [3, 7, 5]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return a 4x4 matrix : `[[0], [1:2:5]; [2, 6; 3, 7], [4:5; 5:6]]`", function (done) {
        var str = "[[0], [1:2:5]; [2, 6; 3, 7], [4:5; 5:6]]";
        var correct = [
          [0, 1, 3, 5],
          [2, 6, 4, 5],
          [3, 7, 5, 6]
        ];
        parser.evaluate(str, function (err, out) {
          console.debug("input : " + str);
          console.debug("output : ");
          console.debug(out[0].ans);

          $J.expect(out[0].ans).toEqual(correct);
          done();
        });
      });

      $J.it("should return and exception : `[[0], [1, 10, 11]; [2, 6; 3, 7], [4; 5]]`", function (done) {
        var str = "[[0], [1, 10, 11]; [2, 6; 3, 7], [4; 5]]";
        parser.evaluate(str, function (err, ans) {
          $J.expect(err).toEqual("Exception with MATRIX: malformed matrix.");
          done();
        });
      });

      $J.it("should return an exception : `[[0], [1, 10]; [2; 3, 7], [4; 5]]`", function (done) {
        var str = "[[0], [1, 10]; [2; 3, 7], [4; 5]]";
        parser.evaluate(str, function (err, ans) {
          $J.expect(err).toEqual("Exception with MATRIX: malformed matrix.");
          done();
        });
      });

    });

  });

});