define([], function () {

  // # OperatorFactory.js
  // Takes and expression and wraps it with an operator.

  function MOperator(regexp) {
    this.regexp = regexp;
  }

  // Overloaded by the factory
  MOperator.prototype.expression = function (_input, _pos, exp, operators) {
  };

  function operatorFactory(regexp, expression) {
    var out = new MOperator(regexp);
    out.expression = expression;
    return out;
  }

  return operatorFactory;

});