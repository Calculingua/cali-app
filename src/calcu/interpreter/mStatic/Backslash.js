define([
  "../../extend",
  "../mExpression",
  "numeric"
], function (extend, mExpression, numeric) {

  function Backslash(_input, _pos, exp, operators) {
    // super class
    this.uber("BACKSLASH", 18, 2, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(Backslash, mExpression);

  Backslash.prototype.interpret = function (opts, callback) {
    var self = this;

    if (this.args.length !== 2) {
      return callback("Operator Error :: BACKSLASH : missing argument.");
    }

    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: BACKSLASH : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: BACKSLASH : missing argument.");

        var outData = [
          []
        ];
        try {
          outData = numeric.solve(lMatrix, rMatrix);
          outData = numeric.transpose([outData]);
        } catch (e) {
          err = "Opperation Error : BACKSLASH : matrices have wrong numbers of rows/columns.";
        } finally {
          callback(err, outData);
        }
      });
    });
  };

  return Backslash;
});