define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function String(_input, _pos, exp, operators) {
    // super class
    this.uber("STRING", 200, 1, _input, _pos);

    this.string = _input[this.pos].token;
    this.string = this.string.slice(1, this.string.length - 1);

    this.parent = exp;
    this.parent.args.push(this);
    this.args.push(this);

    this.pos++;
  }

  extend.call(String, mExpression);

  String.prototype.interpret = function (opts, callback) {

    var out = [ this.string.split("") ];
    callback(null, out);
  };


  return String;

});