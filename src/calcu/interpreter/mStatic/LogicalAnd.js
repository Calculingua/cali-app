define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function LogicalAnd(_input, _pos, exp, operators) {
    // super class
    this.uber("AND", 8, 2, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(LogicalAnd, mExpression);

  LogicalAnd.prototype.interpret = function (opts, callback) {

    if (this.args.length <= 1) {
      return callback("Operator Error :: AND : missing argument.");
    }

    var self = this;
    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback(err);

      var outData = [
        [0]
      ];

      if (lMatrix.length != 1 || lMatrix[0].length != 1) {
        return callback("Operation Error :: AND :: requires scalar values convertible to logicals.");
      }
      if (!lMatrix[0][0])
        return callback(null, [
          [0]
        ]);

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback(err);

        if (rMatrix.length != 1 || rMatrix[0].length != 1) {
          return callback("Operation Error :: AND :: requires scalar values convertible to logicals.");
        }

        return callback(null, (lMatrix[0][0] && rMatrix[0][0]) ? [
          [1]
        ] : [
          [0]
        ]);
      });

    });

  };

  return LogicalAnd;

});