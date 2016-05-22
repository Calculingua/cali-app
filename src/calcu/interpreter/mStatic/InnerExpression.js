define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {


  function InnerExpression(_input, _pos, exp, operators) {
    // super method
    this.uber("INNER_EXPRESSION", 25, 1, _input, _pos);

    this.parent = exp;
    this.parent.args.push(this);

    // console.log("char = " + _input[this.pos].token);
    this.pos++;
    // console.log("char = " + _input[this.pos].token);
    this.oop = 0;
    // process the input array
    while (this.pos < _input.length) {

      // get the operator form the operators
      var opp = operators.get(_input[this.pos]);
      // if an appropriate opp was found
      if (opp != null) {
        // create a new one and add it to the array
        exp = new opp.expression(_input, this.pos, this, operators);
        // this.args.push(exp);
        // update the position with the value from the new expression
        this.pos = exp.getFinalPosition();
      }
      // if it wasn't found, look for something else
      else {
        // if it is a close parens
        if (_input[this.pos].token == ")") {
          // exit parsing this sub-Expression
          this.pos++;
          break;
        } else {
          // otherwise, throw an exception
          throw ("Exception, unknown token.");
        }
      }
    }
    this.oop = 25;
  }

  extend.call(InnerExpression, mExpression);

  InnerExpression.prototype.interpret = function (opts, callback) {
    if (this.args.length < 1) {
      return callback("Operator Error :: INNER EXPRESSION : missing argument.");
    }
    // interpret the answer and place it in the output variable
    this.args[0].interpret(opts, callback);
  };

  return InnerExpression;
  
});