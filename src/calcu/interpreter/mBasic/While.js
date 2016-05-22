define([
  "../../extend",
  "../mExpression",
  "./Expression",
  "async"
], function (extend, mExpression, Expression, async) {


  function While(_input, _pos, exp, operators) {
    // super class
    this.uber("IF", 0, 1, _input, _pos);

    if (exp) {
      this.parent = exp;
      this.parent.push(this);
    }

    this.exec = [];
    this.pos++;

    // store the variables
    var comp = new Expression(_input, this.pos, this, operators);
    this.pos = comp.getFinalPosition();
    this.args.push(comp);

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
        default:
          exp = new Expression(_input, this.pos, this, operators);
          this.pos = exp.getFinalPosition();
          this.exec.push(exp);
          break;
      }
    }
  }

  extend.call(While, mExpression);

  While.prototype.check = function (matrix) {
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

  While.prototype.interpret = function (opts, callback) {

    var self = this;
    opts.variables["break"] = [
      [0]
    ];
    opts.variables["continue"] = [
      [0]
    ];

    var end = false;
    var cont = false;

    var _outputCallback = opts.outputCallback;
    opts.outputCallback = function (type, variable, print) {
      if (type == "result" && variable.name == "break") {
        end = true;
      } else if (type == "result" && variable.name == "continue") {
        cont = true;
      } else {
        _outputCallback(type, variable, print);
      }
    };

    var done = false;
    async.doWhilst(function (whilstCb) {

      self.args[0].args[0].interpret(opts, function (err, test) {

        if (self.check(test) && !end) {
          async.eachSeries(self.exec, function (item, eachCb) {
            item.interpret(opts, function (err, ans) {
              if (cont) {
                cont = false;
                eachCb("stopping this itteration");
              } else {
                eachCb(err);
              }
            });
          }, function (err) {
            whilstCb();
          });
        } else {
          done = true;
          whilstCb();
        }
      });
    }, function () {
      return !done;
    }, function (err) {
      delete opts.variables["break"];
      delete opts.variables["continue"];
      opts.outputCallback = _outputCallback;
      callback(err);
    });

  };

  return While;
});