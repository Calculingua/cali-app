define([
  "../../extend",
  "../mExpression",
  "./Expression",
  "async"
], function (extend, mExpression, Expression, async) {

  function Line(_input, _pos, exp, operators) {
    // super method
    this.uber("LINE", 0, 1, _input, _pos);

    this.parent = exp;
    // figure out the line number
    this.kLine = _input[this.pos].line;
    this.toks = [];
    while (_input[this.pos].token != "\n") {
      this.toks.push(_input[this.pos].token);
      var expression = new Expression(_input, this.pos, this, operators);
      this.pos = expression.getFinalPosition();
      this.args.push(expression);
    }
    // figure out the line number
    this.lenLine = _input[this.pos].line - this.kLine + 1;
  }

  extend.call(Line, mExpression);

  Line.prototype.interpret = function (opts, callback) {
      var self = this;
    var lines = {
      start: this.kLine,
      length: this.lenLine
    };
    opts.outputCallback("lines", lines);
    var i = 0;
    async.eachSeries(self.args, function (item, incremental) {
        i++;
      item.interpret(opts, incremental);
    }, function (err) {
      callback(err);
    });
  };

  return Line;
});