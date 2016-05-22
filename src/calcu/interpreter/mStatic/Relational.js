define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function size(x) {

    var nRows = 0;
    var nCols = x[0].length;
    if (nCols > 0) {
      nRows = x.length;
    }
    return [
      [nRows, nCols]
    ];
  }

  function Relational(_input, _pos, exp, operators) {
    // super class
    this.uber("RELATIONAL", 12, 2, _input, _pos);

    this.rel = _input[this.pos].token;

    // store the variables
    this.pos++;
    this.fillFirstArg(exp);
    this.fillSecondArg(_input, operators);
  }

  extend.call(Relational, mExpression);

  Relational.prototype.interpret = function (opts, callback) {

    var self = this;
    var i, j;

    if (this.args.length !== 2) {
      return callback("Operator Error :: RELATIONAL : missing argument.");
    }

    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: RELATIONAL : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: RELATIONAL : missing argument.");

        // get the correct operator
        var func = null;
        switch (self.rel) {
          case "==":
            func = self.eq;
            break;
          case ">":
            func = self.gr;
            break;
          case "<":
            func = self.le;
            break;
          case "<=":
            func = self.leq;
            break;
          case ">=":
            func = self.geq;
            break;
          case "~=":
            func = self.neq;
            break;
        }

        // do matrix size checking first
        var lSize = size(lMatrix);
        var rSize = size(rMatrix);

        // initialize the output matrix;
        var outData = [];
        if (lSize[0][0] == rSize[0][0] && lSize[0][1] == rSize[0][1]) {
          // check the matrices
          for (j = 0; j < lMatrix.length; j++) {
            // check that the matrices are the same size
            outData[j] = [];
            for (i = 0; i < lMatrix[0].length; i++) {
              outData[j][i] = func.call(self, lMatrix[j][i], rMatrix[j][i]);
            }
          }
        } else if (rSize[0][0] == 1 && rSize[0][1] == 1) {
          // check the matrices
          for (j = 0; j < lMatrix.length; j++) {
            // check that the matrices are the same size
            outData[j] = [];
            for (i = 0; i < lMatrix[0].length; i++) {
              outData[j][i] = func.call(self, lMatrix[j][i], rMatrix[0][0]);
            }
          }
        } else if (lSize[0][0] == 1 && lSize[0][1] == 1) {
          // check the matrices
          for (j = 0; j < rMatrix.length; j++) {
            // check that the matrices are the same size
            outData[j] = [];
            for (i = 0; i < rMatrix[0].length; i++) {
              outData[j][i] = func.call(self, rMatrix[j][i], lMatrix[0][0]);
            }
          }
        } else {
          return callback("Opperation Error : " + self.rel + " : matrices have incorrect sizes.");
        }
        callback(null, outData);
      });
    });
  };

  Relational.prototype.eq = function (arg1, arg2) {
    return (arg1 == arg2) ? 1 : 0;
  };

  Relational.prototype.gr = function (arg1, arg2) {
    return (arg1 > arg2) ? 1 : 0;
  };

  Relational.prototype.le = function (arg1, arg2) {
    return (arg1 < arg2) ? 1 : 0;
  };

  Relational.prototype.leq = function (arg1, arg2) {
    return (arg1 <= arg2) ? 1 : 0;
  };

  Relational.prototype.geq = function (arg1, arg2) {
    return (arg1 >= arg2) ? 1 : 0;
  };

  Relational.prototype.neq = function (arg1, arg2) {
    return (arg1 != arg2) ? 1 : 0;
  };

  return Relational;

});