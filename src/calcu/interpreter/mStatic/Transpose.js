define([
  "../../base/transpose",
  "../../extend",
  "../mExpression"
], function (transpose, extend, mExpression) {

  function Transpose(_input, _pos, exp, operators) {
    // super class
    this.uber("TRANSPOSE", 20, 1, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
  }

  extend.call(Transpose, mExpression);

  Transpose.prototype.interpret = function (opts, callback) {

    if (this.args.length < 1) {
      return callback("Operator Error :: TRANSPOSE : missing argument.");
    }

    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: TRANSPOSE : missing argument.");
      var outData = transpose(lMatrix);
      callback(null, outData);
    });
  };

  return Transpose;

});