define([
  '../lib/polyval'
], function (polyvalLib) {

  function polyval(coefficients, x) {

    if (!(coefficients[0] instanceof Array)) {
      throw new Error("coefficients should be an array");
    }

    var ys;
    if (x[0] instanceof Array) {
      ys = polyvalLib.polyvalMulti(coefficients[0], x[0]);
    } else {
      throw new Error("x should be an array");
    }

    return [ys];

  }

  polyval.async = false;
  polyval.shortHelp = "Evaluates a polynomial function for a list of given values";
  polyval.help = "# polyval(coefficients, x) \n \
evaluates the polynomial function defined by its coefficients for each value in x.\n";

  return polyval;

});