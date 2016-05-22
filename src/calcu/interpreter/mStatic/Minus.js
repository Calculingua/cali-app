define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {


  function Minus(_input, _pos, exp, operators) {
    // super class
    this.uber("SUBTRACTION", 16, 2, _input, _pos);

    // store the variables
    this.pos++;
    switch (this.fillFirstArg(exp)) {
      case this.NO_CHILDREN:
      case this.ORPHANED_CHILD:
        if (this.pos < _input.length) {
          var opp = operators.get(_input[this.pos]);
          var x = new opp.expression(_input, this.pos, exp, operators);
          x.negate();
          this.pos = x.getFinalPosition();
        } else {
          throw ("Expression Error with " + this.type + ": Insufficient number of arguments. ");
        }
        break;
      case this.SUCCESS:
        this.fillSecondArg(_input, operators);
        break;
    }
  }

  extend.call(Minus, mExpression);

  Minus.prototype.interpret = function (opts, callback) {
    var self = this;

    if (this.args.length !== 2) {
      return callback("Operator Error :: SUBTRACTION : missing argument.");
    }

    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {
      if (err) return callback("Operator Error :: SUBTRACTION : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {
        if (err) return callback("Operator Error :: SUBTRACTION : missing argument.");

        // initialize the output matrix;
        var outData = [];
        // add the matrices
        for (var i = 0; i < lMatrix.length; i++) {
          // check that the matrices are the same size
          if (lMatrix.length != rMatrix.length) {
            return callback("Opperation Error : SUBTRACTION : matrices have different numbers of rows.");
          }
          outData[i] = new Array(lMatrix[i].length);
          for (var j = 0; j < lMatrix[i].length; j++) {
            // check that the matrices are the same size
            if (lMatrix[i].length != rMatrix[i].length) {
              return callback("Opperation Error : SUBTRACTION : matrices have different numbers of columns.");
            }
            outData[i][j] = lMatrix[i][j] - rMatrix[i][j];
          }
        }
        callback(null, outData);
      });
    });
  };

  return Minus;

});