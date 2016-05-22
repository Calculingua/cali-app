define([
  "../../base/mtimes",
  "../../extend",
  "../mExpression"
], function (mtimes, extend, mExpression) {

  function Multiply(_input, _pos, exp, operators) {
    // super class
    this.uber("MULTIPLICATION", 18, 2, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(Multiply, mExpression);

  Multiply.prototype.interpret = function (opts, callback) {
    var self = this;

    if (this.args.length !== 2) {
      return callback("Operator Error :: MULTIPLICATION : missing argument.");
    }

    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: MULTIPLICATION : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: MULTIPLICATION : missing argument.");

        var i, j;
        var outData;
        try {
          outData = mtimes(lMatrix, rMatrix);
        } catch (ex) {
          err = "Operation Error : MULTIPLICATION : matrices have different numbers of rows/columns.";
        }
        finally {
          callback(err, outData);
        }
      });
    });
  };

  return Multiply;

});