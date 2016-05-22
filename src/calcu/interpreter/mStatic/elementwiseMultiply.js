define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {


  function ElementwiseMultiply(_input, _pos, exp, operators) {
    // super class
    this.uber("ELEMENTWISE MULTIPLICATION", 18, 2, _input, _pos);

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(ElementwiseMultiply, mExpression);

  ElementwiseMultiply.prototype.interpret = function (opts, callback) {

    if (this.args.length !== 2) {
      return callback("Operator Error :: ELEMENTWISE MULTIPLICATION : missing argument.");
    }

    var self = this;
    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: ELEMENTWISE MULTIPLICATION : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: ELEMENTWISE MULTIPLICATION : missing argument.");


        var outData = [];
        if (rMatrix.length == lMatrix.length && rMatrix[0].length == lMatrix[0].length) {
          outData = numeric.mul(lMatrix, rMatrix);
        } else if (rMatrix.length == 1 && rMatrix[0].length == 1) {
          for (var i = 0; i < lMatrix.length; i++) {
            outData.push([]);
            for (var j = 0; j < lMatrix[i].length; j++) {
              outData[i].push(lMatrix[i][j] * rMatrix[0][0]);
            }
          }
        } else {
          return callback("Operator Error :: ELEMENTWISE MULTIPLICATION : poorly formed RHS.");
        }

        callback(null, outData);
      });
    });
  };

  return  ElementwiseMultiply;

});