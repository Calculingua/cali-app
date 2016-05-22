define([
  "../../extend",
  "../../mType/CellArrayType",
  "../mExpression",
  "../mNative/getColumn",
  "../mNative/getProperty"
], function (extend, CellArrayType, mExpression, getColumn, getProperty) {


  function Variable(_input, _pos, exp, operators) {
    // super class
    this.uber("VARIABLE", 50, 1, _input, _pos);

    this.name = _input[this.pos].token;
    this.operators = operators;

    this.posStart = _pos;
    this.input = _input.slice(0, _input.length - 1);

    // store the name
    this.parent = exp;
    this.parent.args.push(this);
    this.args.push(this);

    this.pos++;
  }

  extend.call(Variable, mExpression);

  Variable.prototype.interpret = function (opts, callback) {
    var self = this;
    // initialize the output
    var out = 0;
    var err = null;
    // if the variable is contained in the argument, set the output
    var func = null;
    if (this.name.split(".").length > 1) {
      var props = this.name.split(".");
      try {
          switch(opts.variables[props[0]].type){
          case "TABLE":
              var pp = new CellArrayType();
              if (props[1] == "Properties") {
                pp[0] = props[2].split("");
                out = getProperty(opts.variables[props[0]], pp);
              } else {
                pp[0] = props[1].split("");
                out = getColumn(opts.variables[props[0]], pp);
              }
              break;
          case "HASH_TABLE":
              console.log("variable:", opts.variables[props[0]]);
              out = opts.variables[props[0]].data[props[1]];
              for(var i = 2; i < props.length; i++){
                  out = out.data[props[i]];
              }
              break;
          default:
              throw "not supported";
          }
      } catch (ex) {
        err = ex.toString();
      }
      callback(err, out);
    } else if (opts.variables[this.name] != null) {
      // return the output
      callback(null, opts.variables[this.name]);
    } else {

      self.operators.applyFunction(this.name, self, [], opts, function (err, out) {
        // check the parent to see if there are any trailing arguments
        if (self.parent && self.parent.parent && self.parent.parent.type && self.parent.parent.type == "LINE") {
          var i = self.parent.parent.args.indexOf(self.parent);
          while (i < self.parent.parent.args.length - 1) {
            self.parent.parent.args.pop();
          }
        }
        // return the output
        if (err) return callback("Exception with variable '" + self.name + "', variable not initialized.");

        callback(err, out);
      });
    }
  };

  return Variable;

});