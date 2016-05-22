define(["../mExpression", "../../extend"], function (mExpression, extend) {

  function Number(_input, _pos, exp, operators) {
    // super class
    this.uber("NUMBER", 200, 1, _input, _pos);

    this.number = parseFloat(_input[this.pos].token);

    this.parent = exp;
    this.parent.args.push(this);
    this.args.push(this);

    this.pos++;
  }

  extend.call(Number, mExpression);

  Number.prototype.interpret = function (opts, callback) {
    callback(null, [
      [ this.number ]
    ]);
  };

  Number.prototype.negate = function () {
    this.number *= -1;
  };

  return Number;

});