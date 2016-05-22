define([
  "./interpreter/mBasic/Comment",
  "./interpreter/mBasic/Function",
  "./interpreter/mBasic/mFunction",
  "./interpreter/mBasic/Number",
  "./interpreter/mBasic/Variable",
  "./interpreter/OperatorFactory",
  "async"
], function (Comment, MBasicFunction, mFunction, Number, Variable, operatorFactory, async) {

  function OperatorBus(parser) {
    this.parser = parser;
    this.staticOperators = {};
    this.pathOperators = {};
    this.funcList = {};
    this.localFuncPaths = {};

    this.order = [];

    this.number = operatorFactory(/^(-|\+|)[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/, Number);
    this.variable = operatorFactory(/^([A-z_][\w]*)/, Variable);
    this.func = operatorFactory(/^([A-z_][\w.]*)(\s*)\(/, mFunction);
    this.comment = operatorFactory(/^%.*/, Comment);

    // list of reserved characters
    this.reservedRegexp = /^(\|{2}|[\-+*\/\\()\[\]\^|,;'":]|==?|<=?|>=?|\.\*|\.\/|\.\^|~=?|\|\||if|elseif|else|for|while|end|switch|case|otherwise|(^([A-z_][\w]*)(\s*)\{)|\{|\})/;
    this.numRegexp = /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
    this.variableRegexp = /^([A-z_][\w]*)/;
    this.functionRegexp = /^([A-z_][\w.]*)(\s*)\(/;
    this.commentRegexp = /^%.*/;
    this.dotPropertyRegexp = /^([A-z_][\w]*)(\.([A-z_][\w]*))+/;
    this.variable2Regexp = /^([a-zA-Z_][\w]*)(\.([a-zA-Z_][\w]*))*/;
  }

  OperatorBus.prototype.addModule = function (module) {
    for (var name in module) {
      this.addFunction(name, module[name]);
    }
  };

  OperatorBus.prototype.addStatic = function (operator) {
    this.staticOperators[operator.regexp] = operator;
    this.order.push(operator.regexp);
    this.regexpString += operator.regexp;
  };

  OperatorBus.prototype.getOrder = function () {
    return this.order;
  };

  OperatorBus.prototype.addFunction = function (regexp, func) {
    this.funcList[regexp] = func;
  };

  OperatorBus.prototype.getFunction = function (regexp, callback) {
    var self = this;
    var func = this.funcList[regexp];

    if (typeof func == "undefined" && self.parser.model && self.parser.model.file) {

      async.waterfall([
        function (cb) {
          if (self.localFuncPaths[regexp]) {
            cb(null, self.localFuncPaths[regexp]);
          } else {
            self.parser.model.file.readDir("", function (err, list) {
              if (err) return cb(err);
              for (var i = 0; i < list.length; i++) {
                if (list[i].name == (regexp + ".m")) {
                  if (list[i].isFile) {
                    return cb(null, list[i].path);
                  }
                }
              }
              return cb("function file not found");
            });
          }
        },
        function (path, cb) {
          self.parser.model.file.readFile(path, function (err, contents) {
            if (contents) {
              var args = self.parser.preprocess(contents);
              var exp = new MBasicFunction(args, 0, null, self.parser.operators);
              self.localFuncPaths[regexp] = path;
              cb(null, exp.execute);
            } else {
              cb("file contained no function");
            }
          });
        }
      ], function (err, exp) {
        callback(err, exp);
      });
    } else {
      callback(null, func);
    }
  };

  OperatorBus.prototype.applyFunction = function (name, callee, args, opts, callback) {
    var self = this;
    this.getFunction(name, function (err, func) {
      if (func) {
        try {
          var line = callee.parent.parent.toks;
          var that = {
            variables: opts.variables,
            self: callee,
            operators: self,
            line: line,
            parser: self.parser
          };
          if (func.async) {
            args.push(callback);
            func.apply(that, args);
          } else {
            var out = func.apply(that, args);
            callback(null, out);
          }
        } catch (ex) {
          callback(ex.toString());
        }
      } else {
        return callback("Exception with " + callee.type + ": unknown token.");
      }
    });
  };

  OperatorBus.prototype.get = function (char) {
    // initialize the output
    var out = null;
    // check to see if it's a number
    if (char.token.match(this.number.regexp)) {
      out = this.number;
    }
    // if it's a function
    else if (char.token.match(this.func.regexp)) {
      out = this.func;
    }
    // if it's a comment
    else if (char.token.match(this.comment.regexp)) {
      out = this.comment;
    }
    // otherwise...
    else {
      // see if it is in the static operators
      for (var regexp in this.staticOperators) {
        var test = this.staticOperators[regexp].regexp.test(char.token);
        if (test) {
          out = this.staticOperators[regexp];
          break;
        }
      }
      // if not, make it a variable
      if (out == null && char.token.match(this.variable.regexp)) {
        out = this.variable;
      }
    }
    // return
    return out;
  };

  return OperatorBus;

});