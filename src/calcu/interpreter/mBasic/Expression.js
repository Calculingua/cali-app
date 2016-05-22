define([
  "../../extend",
  "../../mType/CellArrayType",
  "../mExpression",
  "../mNative/setColumn",
  "../mNative/setProperty"
], function (extend, CellArrayType, mExpression, setColumn, setProperty) {

  function Expression(_input, _pos, exp, operators) {
    // super method
    this.uber("EXPRESSION", 0, 1, _input, _pos);

    this.output = null;
    this.printFlag = true;

    this.parent = exp;

    // this.args.push(this);
    var maxLoops = 1000;
    var loop = 0;
    var prev_pos = 0;
    // process the input array
    while (this.pos < _input.length) {
      if (this.args.length > 1) {
        delete this.args[1];
        this.pos = prev_pos;
        break;
      } else {
        prev_pos = this.pos;
      }

      // get the operator from the operators
      var opp = operators.get(_input[this.pos]);
      // if an appropriate opp was found
      if (opp != null) {
        // create a new one and add it to the array
        exp = new opp.expression(_input, this.pos, this, operators);
        // update the position with the value from the new expression
        this.pos = exp.getFinalPosition();
      }
      // if it wasn't found, look for something else
      else {
        // if it is a semicolon
        if (_input[this.pos].token == ";") {
          // switch the print flag and exit the loop
          this.printFlag = false;
          this.pos++;
          break;
        } else if (_input[this.pos].token == ",") {
          // don't switch the print flag and exit the loop
          this.pos++;
          break;
        }
        // otherwise, if it is an equivalence operator
        else if (_input[this.pos].token == "=" && this.output == null) {
          // if the previous entry is a variable
          if (this.args[this.args.length - 1].type == "VARIABLE") {
            // make it the output variable and remove it from the
            // array
            this.output = this.args[this.args.length - 1].name;
            this.args.splice(this.args.length - 1, 1);
            this.pos++;
          }
          // if it's a function, then we're trying to set a specific
          // entry in the variable
          else if (this.args[this.args.length - 1].type == "FUNCTION") {
            this.output = this.args[this.args.length - 1].operator;
            this.accessType = "MATRIX";
            this.innterSetting = this.args[this.args.length - 1].funcArgs;
            this.args.splice(this.args.length - 1, 1);
            this.pos++;
          } else if (this.args[this.args.length - 1].type == "MATRIX") {
            this.output = [];
            var outputMat = this.args[this.args.length - 1].data;
            for (var i = 0; i < outputMat[0].length; i++) {
              if (outputMat[0][i].type == "VARIABLE") {
                this.output.push(outputMat[0][i].name);
              } else {
                throw ("Exception with assignment operator. The LHS is not a variable.");
              }
            }
            this.args.splice(this.args.length - 1, 1);
            this.pos++;
          }
          // it it's a CellAccess, then we are trying to set a specific entry
          // in the cell array.
          else if (this.args[this.args.length - 1].type == "CELL_ACCESS") {
            this.output = this.args[this.args.length - 1].name;
            this.accessType = "CELL_ARRAY";
            this.innterSetting = this.args[this.args.length - 1].args;
            this.args.splice(this.args.length - 1, 1);
            this.pos++;
          }
          // if not a variable, throw an expression
          else {
            throw ("Exception with assignment operator. The LHS is not a variable.");
          }
        } else {
          break;
        }
      }
      if (loop++ > maxLoops) {
        throw ("Maximum number of loops exceeded");
      }
    }

    this.nameGiven = true;
    this.candidateOutput = null;
    // figure out the output variable
    if (this.output == null) {
      // if the first entry in the expression array is a variable...
      // make it the variable name
      if (this.args[0].type == "VARIABLE") {
        this.candidateOutput = this.args[0].name;
      }
      this.output = "ans";
      this.nameGiven = false;
    }
  }

  extend.call(Expression, mExpression);

  Expression.prototype.interpret = function (opts, callback) {
    var self = this;

    // interpret the answer and place it in the output variable
    this.args[0].interpret(opts, function (err, ans) {
      if (err) return callback(err);

      // if there is an answer
      if (ans != null) {
        if (ans.text) {
          output = {
            text: ans.text
          };
          opts.outputCallback("result", output, self.printFlag);
          callback(null, ans);
        } else {
          if (self.candidateOutput && opts.variables[self.candidateOutput]) {
            self.output = self.candidateOutput;
          }
          if (self.innterSetting) {
            self.innterSetting[0].interpret(opts, function (err, iArray) {
              if (err) return callback(err);

              self.innterSetting[1].interpret(opts, function (err, jArray) {
                if (err) return callback(err);

                for (var xi = 0; xi < iArray[0].length; xi++) {
                  for (var xj = 0; xj < jArray[0].length; xj++) {
                    switch (self.accessType) {
                      case "MATRIX":
                        var ki = iArray[0][xi] - 1;
                        var kj = jArray[0][xj] - 1;
                        if (ki == opts.variables[self.output].length) {
                          opts.variables[self.output].push([]);
                        }
                        opts.variables[self.output][ki][kj] = ans[xi][xj];
                        break;
                      case "CELL_ARRAY":
                        if (!opts.variables[self.output].type || opts.variables[self.output].type !== "CELL_ARRAY") {
                          return callback("Input Error with :: MATRIX :: attempt to access as a CELL_ARRAY");
                        }
                        opts.variables[self.output][iArray[0][xi] - 1][jArray[0][xj] - 1] = ans;
                        break;
                    }
                  }
                }
                output = {
                  name: self.output,
                  ans: opts.variables[self.output]
                };
                opts.outputCallback("result", output, self.printFlag);
                callback(null, ans);
              });
            });
          } else {
            if (typeof self.output == "string") {
              if (self.output.split(".").length > 1) {
                var props = self.output.split(".");
                try {
                  var pp = new CellArrayType();
                  if (props[1] == "Properties") {
                    pp[0] = props[2].split("");
                    setProperty(opts.variables[props[0]], pp, ans);
                  } else {
                    pp[0] = props[1].split("");
                    setColumn(opts.variables[props[0]], pp, ans);
                  }
                } catch (ex) {
                  err = ex.toString();
                }
                output = {
                  name: props[0],
                  ans: opts.variables[props[0]]
                };
              } else {
                opts.variables[self.output] = ans;
                output = {
                  name: self.output,
                  ans: opts.variables[self.output]
                };
              }
              opts.outputCallback("result", output, self.printFlag);
            } else {
              for (var i = 1; i < arguments.length; i++) {
                var name = self.output[i - 1];
                if(typeof name !== "undefined"){
                    var value = arguments[i];
                    opts.variables[name] = value;
                    output = {
                      name: name,
                      ans: value
                    };
                    opts.outputCallback("result", output, self.printFlag);
                }
              }
            }
            callback.apply(this, arguments);
          }
        }
      } else {
        callback(null);
      }
    });
  };

  return Expression;

});