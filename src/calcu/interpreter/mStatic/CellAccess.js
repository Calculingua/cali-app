define([
  "../mBasic/Expression",
  "async",
  "../../extend",
  "../mExpression"
], function (Expression, async, extend, mExpression) {

  function CellAccess(_input, _pos, exp, operators) {
    // super class
    this.uber("CELL_ACCESS", 50, 2, _input, _pos);

    var self = this;

    if (exp) {
      this.parent = exp;
      this.parent.push(this);
    }

    this.name = _input[_pos].token.slice(0, _input[_pos].token.length - 1);
    this.args = [];
    var pos = _pos + 1;

    // process the lines of code.
    done = false;
    while ((_input.length > pos) && !done) {
      switch (_input[pos].token) {
        case ",":
          pos++;
          break;
        case "}":
          pos++;
          done = true;
          break;
        default:
          exp = new Expression(_input, pos, this, operators);
          pos = exp.getFinalPosition();
          this.args.push(exp.args[0]);
          break;
      }
    }
    this.pos = pos;
  }

  extend.call(CellAccess, mExpression);

  CellAccess.prototype.interpret = function (opts, callback) {
    var self = this;

    // error checking:
    // make sure it's a `CELL_ARRAY`
    if (typeof opts.variables[self.name].type == "undefined" || opts.variables[self.name].type != "CELL_ARRAY") {
      return callback("Input Error with :: MATRIX :: attempt to access as a CELL_ARRAY");
    }

    var k = 0;
    async.map(self.args, function (item, itemCallback) {
      if (k === 0) {
        opts.variables.end = [
          [opts.variables[self.name].length]
        ];
      } else {
        opts.variables.end = [
          [opts.variables[self.name][0].length]
        ];
      }
      k++;
      item.interpret(opts, itemCallback);

    }, function (err, index) {
      delete opts.variables.end;
      var out = [err];
      if (err) {
        return callback(err);
      }
      try {
        var i, j;
        var row = [];
        var col = [];

        for (i in index[0]) {
          for (j in index[0][0])
            row.push(index[0][i][j] - 1);
        }

        for (i in index[1]) {
          for (j in index[1][0])
            col.push(index[1][i][j] - 1);
        }

        for (i in row) {
          for (j in col) {
            out.push(opts.variables[self.name][row[i]][col[j]]);
          }
        }

      } catch (ex) {
        return callback(err);
      }

      callback.apply(this, out);
    });
  };

  return CellAccess;

});