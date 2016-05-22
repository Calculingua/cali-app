define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function Divide(_input, _pos, exp, operators) {
    // super class
    this.uber("DIVISION", 18, 2, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(Divide, mExpression);

  Divide.prototype.interpret = function (opts, callback) {
    var self = this;

    if (this.args.length !== 2) {
      return callback("Operator Error :: DIVISION : missing argument.");
    }

    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: DIVISION : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: DIVISION : missing argument.");

        if (rMatrix.length > 1 || rMatrix[0].length > 1) {
          return callback("Operator Error :: DIVISION : argument incorrect dimension.");
        }

        var outData = [];

        for (var i = 0; i < lMatrix.length; i++) {
          outData.push([]);
          for (var j = 0; j < lMatrix[i].length; j++) {
            outData[i].push(1);
            outData[i][j] = lMatrix[i][j] / rMatrix[0][0];
          }
        }

        callback(null, outData);
      });
    });
  };

  return Divide;

});