define([], function () {

  /**
   * this implementation is brute force.
   * Should look into Horner's or Estrins method.
   * https://www.epcc.ed.ac.uk/sites/default/files/Dissertations/2009-2010/Gavin%20Reynolds.pdf
   */
  function polyval(coefficients, x) {
    var i, order;
    var sum = 0;
    for (i = 0, order = coefficients.length - 1; i < coefficients.length; i += 1, order -= 1) {
      sum += coefficients[i] * Math.pow(x, order);
    }
    return sum;
  }

  function polyvalMulti(coefficients, xs) {
    var ys = new Array(xs.length);
    for (var i = 0; i < ys.length; i += 1) {
      ys[i] = polyval(coefficients, xs[i]);
    }
    return ys;
  }

  return {
    polyval: polyval,
    polyvalMulti: polyvalMulti
  };

});