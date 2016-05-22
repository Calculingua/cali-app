define([
  "../../extend",
  "../mExpression",
  "./Expression",
  "async"
], function (extend, mExpression, Expression, async) {


  function If(_input, _pos, exp, operators) {
    // super class
    this.uber("IF", 0, 1, _input, _pos);

    if (exp) {
      this.parent = exp;
      this.parent.push(this);
    }

    this.exec = [
      []
    ];

    // store the variables
    this.pos++;
    var comp = new Expression(_input, this.pos, this, operators);
    this.pos = comp.getFinalPosition();
    this.args.push(comp);

    var kBranch = 0;
    var end = false;
    function HelperExpression() {
      this.type = "EXPRESSION";
      this.args = [];
      this.args[0] = {
        interpret: function (opts, callback) {
          callback(null, [
            [ 1 ]
          ]);
        }
      };
    }
    while (this.pos <= _input.length && !end) {
      switch (_input[this.pos].token) {
        case ",":
        case ";":
        case "\n":
          this.pos++;
          break;
        case "end":
          end = true;
          this.pos++;
          break;
        case "else":
          kBranch++;
          this.pos++;
          this.exec.push([]);
          this.args.push(new HelperExpression());
          break;
        case "elseif":
          kBranch++;
          this.pos++;
          exp = new Expression(_input, this.pos, this, operators);
          this.pos = exp.getFinalPosition();
          this.exec.push([]);
          this.args.push(exp);
          break;
        default:
          exp = new Expression(_input, this.pos, this, operators);
          this.pos = exp.getFinalPosition();
          this.exec[kBranch].push(exp);
          break;
      }
    }
  }

  extend.call(If, mExpression);

  If.prototype.check = function (matrix) {
    var out = true;
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (!matrix[i][j]) {
          return false;
        }
      }
    }
    return out;
  };

  If.prototype.interpret = function (opts, callback) {
    var self = this;

    var i = -1;
    async.detectSeries(self.args, function (item, testCb) {
      i++;
      item.args[0].interpret(opts, function (err, ans) {
        if (err) {
          testCb(false);
        } else {
          var test = ans || [
            [0]
          ];
          var check = self.check(test);
          testCb(check);
        }
      });
    }, function (result) {
      if (result === undefined) return callback();

      async.eachSeries(self.exec[i], function (item, execCb) {
        item.interpret(opts, execCb);
      }, function (err) {
        return callback(err);
      });
    });
  };

  return If;

});