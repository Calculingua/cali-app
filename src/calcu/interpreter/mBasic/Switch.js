define([
  "./Expression",
  "async",
  "../../extend",
  "../mExpression"
], function (Expression, async, extend, mExpression) {

  function Switch(_input, _pos, exp, operators) {
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
        case "otherwise":
          kBranch++;
          this.pos++;
          this.exec.push([]);
          this.args.push(this.args[0]);
          break;
        case "case":
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

  extend.call(Switch, mExpression);

  Switch.prototype.check = function (test, check, callback) {

    if (test.length > 1 || test[0].length > 1) {
      return callback("Operator Error :: SWITCH : switch expression should be a scalar or string.");
    }

    if (check.length > 1 || check[0].length > 1) {
      return callback("Operator Error :: SWITCH : case expression should be a scalar, string, or cell array of scalars or strings.");
    }

    return callback(null, test[0][0] == check[0][0]);
  };

  Switch.prototype.interpret = function (opts, callback) {
    var self = this;
    var test = null;

    this.args[0].args[0].interpret(opts, function (err, test) {
      if (err) return callback("Operator Error :: SWITCH : switch expression should be a scalar or string.");
      var i = -1;
      var innerError = null;
      async.detectSeries(self.args, function (arg, detectCb) {
        i++;
        if (i === 0) return detectCb(false);
        arg.args[0].interpret(opts, function (err, cc) {
          innerError = err;
          if (err) return detectCb(true);

          var check = (typeof cc !== "undefined") ? cc : [
            [0]
          ];

          self.check(test, check, function (err, detected) {
            if (err) {
              innerError = err;
              detectCb(true);
            } else {
              detectCb(detected);
            }
          });
        });

      }, function (result) {
        if (innerError) return callback(innerError);

        async.eachSeries(self.exec[i], function (item, eachCb) {
          item.interpret(opts, function (err, ans) {
            if (err) return eachCb("Operator Error :: SWITCH : expression errored.");
            eachCb();
          });
        }, function (err) {
          callback(err);
        });
      });
    });

  };

  return Switch;
});