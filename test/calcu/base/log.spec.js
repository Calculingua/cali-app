define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/log"
], function ($J, CommandParser, Matchers, logF) {


  $J.describe("cali.module.base.log", function () {

    // setup the environment
    var parser = null;
    var eye = null;
    var eps;
    var input;
    beforeEach(function () {
      parser = new CommandParser();
      log = logF.log;
      log10 = logF.log10;
      log2 = logF.log2;
      $J.jasmine.Expectation.addMatchers(Matchers);
      eps = 1e-4;
      input = [
        [1, 2],
        [3, 4]
      ]
    });

    it("should computes natural logrithm of the input", function () {
      var output = [
        [0, 0.6931471806],
        [1.098612289, 1.386294361]
      ];
      expect(log(input)).toBeMatrixCloseTo(output, eps);
    });
    it("should compute logrithm base 10 of the input", function () {
      var output = [
        [0, 0.3010299957],
        [0.4771212547, 0.6020599913]
      ];
      expect(log10(input)).toBeMatrixCloseTo(output, eps);
    });
    it("should computes natural logrithm of the input", function () {
      var output = [
        [0, 1],
        [1.584962501, 2]
      ];
      expect(log2(input)).toBeMatrixCloseTo(output, eps);
    });

  });

});