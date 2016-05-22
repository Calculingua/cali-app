define([
  "../../extend",
  "../mExpression",
  "./Expression",
  "async"], function (extend, mExpression, Expression, async) {

  function Function(_input, _pos, exp, operators) {
    // super class
    this.uber("FUNCTION", 0, 1, _input, _pos);

    var self = this;

    this.inputVars = [];
    this.outputVars = [];
    this.execLines = [];

    // Get the function line
    var pos = _pos + 1;
    this.name = _input[pos].token.split("(")[0];
    var state = "main";
    if (_input[pos].token.split("(").length > 1) {
      state = "inputs";
      pos++;
    }
    var done = false;
    while ((_input.length > pos) && !done) {
      if (_input[pos].token == "\n") {
        break;
      }

      switch (state) {
        case "main":
          switch (_input[pos].token) {
            case "=":
              if (_input[pos - 1].token != "]") {
                this.outputVars.push(_input[pos - 1].token);
              }
              state = "name";
              break;
            case "[":
              state = "outputs";
              break;
            case "(":
              state = "inputs";
              break;
          }
          break;
        case "inputs":
          if (_input[pos].token == ")") {
            state = "main";
          } else if (_input[pos].token == ",") {
            // skipping
          } else {
            this.inputVars.push(_input[pos].token);
          }
          break;
        case "name":
          this.name = _input[pos].token.split("(")[0];
          state = "inputs";
          break;
        case "outputs":
          if (_input[pos].token == "]") {
            state = "main";
          } else if (_input[pos].token == ",") {
            // skipping
          } else {
            this.outputVars.push(_input[pos].token);
          }
          break;
      }
      pos++;
    }

    // process the lines of code.
    done = false;
    while ((_input.length > pos) && !done) {
      switch (_input[pos].token) {
        case ",":
        case ";":
        case "\n":
          pos++;
          break;
        case "end":
          done = true;
          pos++;
          break;
        default:
          exp = new Expression(_input, pos, this, operators);
          pos = exp.getFinalPosition();
          this.execLines.push(exp);
          break;
      }
    }
    this.pos = pos;

    this.execute = function () {

      var variables = {};
      for (var i = 0; i < self.inputVars.length; i++) {
        if (typeof arguments[i] != "function") {
          variables[self.inputVars[i]] = arguments[i];
        }
      }

      var callback = arguments[arguments.length - 1];
      var opts = {variables: variables, outputCallback: function () {
      }};
      async.eachSeries(self.execLines, function (item, incremental) {
        item.interpret(opts, incremental);
      }, function (err) {
        var args = [];
        args.push(err);
        for (var k in self.outputVars) {
          args.push(variables[self.outputVars[k]]);
        }
        callback.apply(this, args);
      });
    };
    this.execute.async = true;

  }

  extend.call(Function, mExpression);

  Function.prototype.interpret = function (opts, callback) {
    callback(null, null);
  };

  return Function;

});