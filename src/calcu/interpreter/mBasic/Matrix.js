define([
  "async",
  "../../extend",
  "../mExpression"
], function (async, extend, mExpression) {


  function Matrix(_input, _pos, exp, operators) {
    // super class
    // mExpression.call(this, "MATRIX", 100, 1, _input, _pos, exp,
    // operators);
    this.uber("MATRIX", 100, 1, _input, _pos);

    this.pos++;

    // initialize the array
    this.data = [
      []
    ];
    this.nRows = 0;
    this.nCols = 0;

    // set the order of operations to the highest level
    // because we don't want a child to make this it's child
    this.oop = 0;

    // step through the array looking for a closing bracket to end on
    while (this.pos < _input.length) {

      if (_input[this.pos].token == "]") {
        this.pos++;
        break;
      } else if (_input[this.pos].token == ",") {
        this.pos++;
      } else if (_input[this.pos].token == ";") {
        this.nRows++;
        this.data.push([]);
        this.nCols = 0;
        this.pos++;
      } else if (_input[this.pos].token == "-") {
        // this is a minus
        _input[this.pos].token = "+";
        _input[this.pos + 1].token = "-" + _input[this.pos + 1].token;
        this.pos++;
      } else if (_input[this.pos].token == "+") {
        // this is a minus
        _input[this.pos].token = "+";
        _input[this.pos + 1].token = "+" + _input[this.pos + 1].token;
        this.pos++;
      } else if ((opp = operators.get(_input[this.pos]))) {
        var x = new opp.expression(_input, this.pos, this, operators);
        this.data[this.nRows][this.nCols] = x;
        this.pos = this.data[this.nRows][this.nCols].getFinalPosition();
        this.nCols++;
      } else {
        throw ("Exception with " + this.type + ": unknown token.");
      }
      // clear out the arguments because no entries can see beyond their
      // place in the matrix.
      this.args = [];
    }

    this.parent = exp;
    this.parent.args.push(this);
    this.args.push(this);
    // set the order of operations back to the correct value
    this.oop = 100;

  }

  extend.call(Matrix, mExpression);

  Matrix.prototype.interpret = function (opts, callback) {
    var self = this;
    // i'll return a 2d array
    var out = [];
    // this is the start of my array indices
    var ii = 0;
    var jj = 0;
    var iInc = 1;
    var jInc = 1;
    // go through every row
    async.eachSeries(this.data, function (row, rowCb) {
      out[ii] = [];

      async.eachSeries(row, function (dd, itemCb) {
        //var dd = self.data[i][j];

        dd.interpret(opts, function (err) {
          if (err) return itemCb(err);

          for (var xi = 1; xi < arguments.length; xi++) {
            var x = arguments[xi];

            for (var iii = 0; iii < x.length; iii++) {
              if (!out[iii + ii]) {
                out[iii + ii] = [];
              }
              for (var jjj = 0; jjj < x[iii].length; jjj++) {
                out[iii + ii][jjj + jj] = x[iii][jjj];

              }
            }
            iInc = x.length;
            jInc = x[0].length;
            jj += jInc;
          }
          itemCb();
        });
      }, function (err) {
        if (err) return rowCb(err);

        var numCols = out[0].length;
        for (var k = ii; k < (ii + iInc); k++) {
          if (numCols != out[k].length) {
            return rowCb("Exception with " + self.type + ": malformed matrix.");
          }
        }
        ii += iInc;
        jj = 0;

        rowCb();
      });

    }, function (err) {
      // todo: switch this to the matrix object
      callback(err, out);
    });
  };

  Matrix.prototype.html = function (variables, outputCallback) {
    // vet the answer for this matrix
    var ans = this.interpret(variables, outputCallback);
    // initialize the html output
    var out = "<table class='matrix'>";
    for (var i = 0; i < ans.length; i++) {
      out += "<tr class='matrixRow'>";
      for (var j = 0; j < ans[i].length; j++) {
        if (typeof ans[i][j] == "string") {
          out += "<td class='matrixEntry'>" + ( ans[i][0].join("") ) + "</td>";
          break;
        } else {
          out += "<td class='matrixEntry'>" + Math.round(ans[i][j] * 1000) / 1000 + "</td>";
        }
      }
      out += "</tr>";
    }
    out += "</table>";
    return out;
  };

  Matrix.prototype.print = function (variables, outputCallback) {
    // get the answer for this matrix
    var ans = this.interpret(variables, outputCallback);
    // initialize the text output
    var out = "";
    for (var i = 0; i < ans.length; i++) {
      for (var j = 0; j < ans[i].length; j++) {
        out += Math.round(ans[i][j] * 1000) / 1000;
        out += "\t";
      }
      out += "\n";
    }
    return out;
  };

  return Matrix;
});
