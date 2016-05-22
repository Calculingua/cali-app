define([
    "../../extend",
    "../mExpression",
    "../mNative/getByIndex",
    "./Variable",
    "../mStatic/InnerExpression",
    "async"], function (extend, mExpression, getByIndex, Variable, InnerExpression, async) {


  function mFunction(input, pos, exp, operators) {
    // super class
    this.uber("FUNCTION", 100, 1, input, pos);

    this.operators = operators;
    // remove the white space
    input[this.pos].token.replace(/\s/g, "");
    // get the operator
    this.operator = input[this.pos].token.split("(")[0];
    // the arguments that will be passed to the function when evaluated
    this.funcArgs = [];
    this.posStart = pos;
    this.input = input.slice(0, input.length - 1);
    // update the position
    this.pos++;
    // set the order of operations to the highest level
    // because we don't want a child to make this it's child
    this.oop = 0;
    var opp, Opp;

    // step through the array looking for a closing bracket to end on
    while (this.pos < input.length) {

      if (input[this.pos].token == ")") {
        this.pos++;
        this.funcArgs.push(this.args[0]);
        this.args = [];
        break;

      } else if (input[this.pos].token == ",") {
        this.pos++;
        this.funcArgs.push(this.args[0]);
        this.args = [];

      } else if (input[this.pos].token == "-") {
        // this is a minus
        input[this.pos].token = "-";
        Opp = operators.get(input[this.pos]);
        opp = new Opp.expression(input, this.pos, this, operators);
        this.pos = opp.getFinalPosition();

      } else if (input[this.pos].token == "+") {
        // this is a minus
        input[this.pos].token = "+";
        Opp = operators.get(input[this.pos]);
        opp = new Opp.expression(input, this.pos, this, operators);
        this.pos = opp.getFinalPosition();

      } else if ((Opp = operators.get(input[this.pos]))) {
        opp = new Opp.expression(input, this.pos, this, operators);
        this.pos = opp.getFinalPosition();

      } else {
        throw ("Exception with " + this.type + ": unknown token.");
      }
    }

    this.args = [];

    this.parent = exp;
    this.parent.args.push(this);
    this.args.push(this);
    // set the order of operations back to the correct value
    this.oop = 100;
  }

  extend.call(mFunction, mExpression);

  mFunction.prototype.evaluateArgs = function (opts, callback) {
    // TODO: make async
    // step through each function argument and interpret it
    async.mapSeries(this.funcArgs, function (item, callback) {
      if (item != null) {
        item.interpret(opts, function (err, ans) {
          callback(err, ans);
        });
      } else {
        callback(null, item);
      }
    }, function (err, args) {
      callback(err, args);
    });
  };

  mFunction.prototype.evaluateVariableRowCol = function (variable, opts, callback) {
    // step through each function argument and interpret it
    var dim = variable;
    var table = false;
    if (variable.type && variable.type == "TABLE") {
      table = true;
      dim = variable.data[0];
    }

    async.mapSeries(this.funcArgs, function (item, callback) {
      if (item != null) {
        var endAdded = false;
        if (opts.variables.end == null) {
          opts.variables.end = [
            [dim.length]
          ];
          if (table) {
            dim = variable.data;
          } else {
            dim = dim[0];
          }
          endAdded = true;
        }
        item.interpret(opts, function () {
          if (endAdded) {
            delete opts.variables.end;
          }
          callback.apply(this, arguments);
        });

      } else {
        callback(null, item);
      }

    }, callback);
  };
  
  mFunction.prototype.isInnerAccess = function(name, variables){
      var out = false;
      var testName = name.split(".")[0];
      if(typeof variables[testName] !== "undefined"){
          out = true;
      }
      return out;
  };

  mFunction.prototype.interpret = function (opts, callback) {
    var self = this;

    function execute(func, args, opts, callback) {
      var out = [];
      args.push(callback);
      if (func) {
        try {
          out = func.apply({
            variables: opts.variables,
            self: self,
            operators: self.operators
          }, args);
        } catch (ex) {
          return callback(ex.toString());
        }
      } else {
        return callback("Exception with " + self.type + ": unknown token.");
      }
    }

    if (self.isInnerAccess(this.operator, opts.variables)) {

      var func = self.getSubMatrix;
      var vTemp = new InnerExpression([
        {
          token: this.operator
        }
      ], -1, this, this.operators);
      vTemp.interpret(opts, function (err, x) {
        if (err) return callback(err);

        self.evaluateVariableRowCol(x, opts, function (err, args) {
          if (err) return callback(err);

          args.unshift(x);
          execute(func, args, opts, callback);
        });
      });
    } else {
      var funcName = this.operator;
      this.evaluateArgs(opts, function (err, args) {
        if (err) return callback(err);

        self.operators.applyFunction(funcName, self, args, opts, callback);
      });
    }
  };

  mFunction.prototype.getSubMatrix = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    var out = getByIndex.apply(this, args);
    callback(null, out);
  };

  return mFunction;

});