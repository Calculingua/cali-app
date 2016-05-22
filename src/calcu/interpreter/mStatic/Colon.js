define([
  "../mBasic/Matrix",
  "../mBasic/Variable",
  "../mBasic/Number",
  "../../extend",
  "../mExpression"
], function (Matrix, Variable, MBasicNumber, extend, mExpression) {

  function Colon(_input, _pos, exp, operators) {
    // super class
    this.uber("COLON", 14, 3, _input, _pos);

    this.pos++;

    // store the variables
    // this.fillFirstArg(exp);
    if (this.fillFirstArg(exp) == this.NO_CHILDREN) {
      if (exp.type == "MATRIX") {
        var x = exp.data[exp.nRows][exp.nCols - 1];
        if (x.type == "NUMBER") {
          this.args.push(x);
          exp.nCols--;
          exp.data[exp.nRows][exp.nCols] = this;
        }
      }
      if (exp.type == "FUNCTION") {
        var one = new Matrix([], 1, this, operators);
        one.data = [
          [new MBasicNumber([{
              token: "1"
            }], 0, one, this.operators)]
        ];
        // this.args.push(one);
        var end = new Variable([
          {
            token: "end"
          }
        ], 0, this, this.operators);
        // this.args.push(end);
        this.parent = exp;
        this.parent.push(this);
        // this.pos++;
        return;
      }
    }
    this.fillSecondArg(_input, operators);
    this.fillThirdArg(_input, operators);
  }

  extend.call(Colon, mExpression);

  Colon.prototype.fillThirdArg = function (input, operators) {
    if (input[this.pos] && input[this.pos].token == ":") {
      this.pos++;
      // get the operator form the operators
      var opp = operators.get(input[this.pos]);
      // if an appropriate opp was found
      if (opp != null) {
        // create a new one and add it to the array
        var exp = new opp.expression(input, this.pos, this, operators);
        // update the position with the value from the new
        // expression
        this.pos = exp.getFinalPosition();
      }
      // if it wasn't found, look for something else
      else {
        throw ("Exception, unknown token.");
      }
    }
  };

  Colon.prototype.interpret = function (opts, callback) {

    var self = this;

    if (this.args.length < 2) {
      return callback("Operator Error :: COLON : missing argument.");
    }

    var lMatrix = null;
    var rMatrix = null;
    var cMatrix = [
      [1]
    ];

    function evaluate(lMatrix, rMatrix, cMatrix, callback) {
      // initialize the output matrix;
      var outData = [
        []
      ];
      // create the incremental variables
      var start = 0;
      var end = 0;
      var inc = 1;

      // if the left matrix is the right size, set the start
      if (lMatrix.length == 1 && lMatrix[0].length == 1) {
        start = lMatrix[0][0];
      }
      // otherwise throw and exception
      else {
        return callback("Operator Error :: COLON :: start argument is the wrong size. Expecting a scalar.");
      }

      // if the right matrix is the right size, set the end
      if (rMatrix.length == 1 && rMatrix[0].length == 1) {
        end = rMatrix[0][0];
      }
      // otherwise, throw and exception
      else {
        return callback("Operator Error :: COLON :: end argument is the wrong size. Expecting a scalar.");
      }

      // if the center matrix is the right size, set the increment
      if (cMatrix.length == 1 && cMatrix[0].length == 1) {
        inc = cMatrix[0][0];
      }
      // otherwise, throw an exception
      else {
        return callback("Operator Error :: COLON :: increment argument is the wrong size. Expecting a scalar.");
      }

      // initialize the incrementing variable
      var entry = start;
      outData[0].push(entry);
      entry += inc;
      // if the increment is positive
      if (inc > 0) {
        // move forware
        while (self.roundToPrecision(entry) <= self.roundToPrecision(end)) {
          outData[0].push(entry);
          entry += inc;
        }
      }
      // if the increment is negative
      else if (inc < 0) {
        // move backward
        while (self.roundToPrecision(entry) >= self.roundToPrecision(end)) {
          outData[0].push(entry);
          entry += inc;
        }
      }
      // if it's zero, throw an error
      else {
        return callback("Operator Error :: COLON :: increment argument is 0.  This is bad!");
      }

      callback(null, outData);
    }

    // get the left and right matrices.
    // evaluate the arguments if the arguments exist
    this.args[0].interpret(opts, function (err, lMatrix) {

      if (err) return callback("Operator Error :: COLON : missing argument.");

      self.args[1].interpret(opts, function (err, rMatrix) {

        if (err) return callback("Operator Error :: COLON : missing argument.");

        if (self.args.length == 3) {
          cMatrix = rMatrix;
          rMatrix = null;
          self.args[2].interpret(opts, function (err, rMatrix) {

            if (err) return callback("Operator Error :: COLON : missing argument.");

            evaluate(lMatrix, rMatrix, cMatrix, callback);
          });
        } else {
          evaluate(lMatrix, rMatrix, cMatrix, callback);
        }

      });
    });
  };

  return Colon;

});
	

