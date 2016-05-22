define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function DotProperty(_input, _pos, exp, operators) {
    // super class
    this.uber("DOT", 18, 2, _input, _pos);

    // store the variables
    this.pos++;
    // var dotTokens = _input.split(".");
    this.args.push(_input[_pos].token.split("."));
    // look ahead for
    // if(_input[this.pos] == "="){
    // 	this.args[1]
    // }

    this.interpret = function (opts, callback) {
      callback("Operator Error :: DOT :: Not implemented.");
    };
  }

  extend.call(DotProperty, mExpression);


  return DotProperty;
});
	


