define([
  "../../extend",
  "../mExpression"
], function (extend, mExpression) {

  function Comment(_input, _pos, exp, operators) {

    this.uber("Comment", 10000, 1, _input, _pos);
    this.comment = _input[_pos];

    this.parent = exp;
    this.parent.args.push(this);
    this.args.push(this);
    this.pos++;
  }

  extend.call(Comment, mExpression);

  Comment.prototype.interpret = function (opts, callback) {

    var x = this.comment.token.replace(/^%\s?/, "");
    opts.outputCallback("comment", x + "\n");

    callback(null, null);
  };

  Comment.process = function (input) {
    var x = input.replace(/^%\s?/, "");
    var out = {
      comment: x + "\n",
      print: true
    };
    return out;
  };

  return Comment;

});