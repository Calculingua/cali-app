define([
  "../../extend",
  "../../mType/MatrixType",
  "../mExpression",
  "./Expression",
  "async"
], function (extend, MatrixType, mExpression, Expression, async) {


  function For(_input, _pos, exp, operators) {
    // super class
    this.uber("FOR", 0, 1, _input, _pos);

    if (exp) {
      this.parent = exp;
      this.parent.push(this);
    }
    this.exec = [];
    this.pos++;

    // remove the leading paren if there is one
    if (_input[this.pos].token == "(") {
      this.pos++;
    }
    var comp = new Expression(_input, this.pos, this, operators);
    if (!comp.nameGiven) {
      throw ("Operation Error :: FOR : unbalanced test expression.");
    }
    this.pos = comp.getFinalPosition();
    this.args.push(comp);

    // remove the trailing paren if there is one
    if (_input[this.pos].token == ")") {
      this.pos++;
    }

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

  extend.call(For, mExpression);

  For.prototype.interpret = function (opts, callback) {
    var self = this;

    this.args[0].args[0].interpret(opts, function (err, test) {
      if (err) return callback("Operator Error :: FOR : test expression errored.");

      opts.variables["break"] = new MatrixType([
        [ 0 ]
      ]);
      opts.variables["continue"] = new MatrixType([
        [ 0 ]
      ]);

      var name = self.args[0].output;
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


      async.eachSeries(test, function (item, cb1) {
        async.eachSeries(item, function (inner, cb2) {
          opts.variables[name] = new MatrixType([
            [ inner ]
          ]);

          var k = -1;
          var called = false;
          cont = false;
          async.whilst(function () {
            k++;
            var check = (k < self.exec.length && !end);
            return check;
          }, function (cb3) {
            if (cont) {
              cb3();
            } else {
              self.exec[k].interpret(opts, function (err, ans) {
                cb3(err);
              });
            }
          }, function (err) {
            cb2(end);
          });

        }, function (err) {
          cb1(err);
        });

      }, function (err) {
        delete opts.variables["break"];
        delete opts.variables["continue"];

        opts.outputCallback = _outputCallback;
        callback(err);
      });
    });
  };

  return For;
});