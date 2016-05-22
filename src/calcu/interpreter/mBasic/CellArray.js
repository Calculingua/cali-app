define([
  "./Expression",
  "../../extend",
  "../../mType/CellArrayType",
  "../mExpression",
  "async"
], function (Expression, extend, CellArrayType, mExpression, async) {

  function CellArray(_input, _pos, exp, operators) {
    // super class
    this.uber("CELL_ARRAY", 0, 1, _input, _pos);

    if (exp) {
      this.parent = exp;
      this.parent.push(this);
    }

    this.array = [
      []
    ];

    var pos = _pos + 1;
    var done = false;
    while ((_input.length > pos) && !done) {
      switch (_input[pos].token) {
        case ",":
          pos++;
          break;
        case "}":
          done = true;
          pos++;
          break;
        case ";":
          pos++;
          this.array.push([]);
          break;
        default:
          exp = new Expression(_input, pos, this, operators);
          exp.args[0].printFlag = false;
          pos = exp.getFinalPosition();
          if (_input[pos].token != "}") {
            pos -= 1;
          }
          this.array[this.array.length - 1].push(exp.args[0]);
          break;
      }
    }
    this.pos = pos;
  }

  extend.call(CellArray, mExpression);

  CellArray.prototype.interpret = function (opts, callback) {
    var self = this;

    async.map(self.array, function (row, rowCallback) {

      async.map(row, function (item, itemCallback) {
        item.interpret(opts, itemCallback);
      }, rowCallback);

    }, function (err, out) {
      var ans = new CellArrayType(out);
      callback(err, ans);
    });
  };

  return CellArray;

});
