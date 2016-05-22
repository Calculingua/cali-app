define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function ElementwisePow(_input, _pos, exp, operators) {
    // super class
    this.uber("ELEMENTWISE EXPONENTIAL", 20, 2, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(ElementwisePow, mExpression);

  ElementwisePow.prototype.interpret = function (opts, callback) {

    if (this.args.length !== 2) {
      return callback("Operator Error :: ELEMENTWISE EXPONENTIAL : missing argument.");
    }

    var self = this;
    var i, j;
    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: ELEMENTWISE EXPONENTIAL : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: ELEMENTWISE EXPONENTIAL : missing argument.");

        var outData = [];
        if (rMatrix.length == lMatrix.length && rMatrix[0].length == lMatrix[0].length) {
          for (i = 0; i < lMatrix.length; i++) {
            outData.push([]);
            for (j = 0; j < lMatrix[i].length; j++) {
              outData[i].push(Math.pow(lMatrix[i][j], rMatrix[i][j]));
            }
          }
        } else if (rMatrix.length == 1 && rMatrix[0].length == 1) {
          for (i = 0; i < lMatrix.length; i++) {
            outData.push([]);
            for (j = 0; j < lMatrix[i].length; j++) {
              outData[i].push(Math.pow(lMatrix[i][j], rMatrix[0][0]));
            }
          }
        } else {
          return callback("Operator Error :: ELEMENTWISE EXPONENTIAL : poorly formed RHS.");
        }

        callback(null, outData);
      });
    });
  };

  return ElementwisePow;
});