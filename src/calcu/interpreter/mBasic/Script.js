define([
  "./Line",
  "async",
  "../../extend",
  "../mExpression"
], function (Line, async, extend, mExpression) {

  function Script(_input, _pos, exp, operators) {
    // super method
    this.uber("SCRIPT", 0, 1, _input, _pos);

    this.parent = exp;

    this.args = [];

    while (this.pos < _input.length) {
      var line = new Line(_input, this.pos, this, operators);
      this.pos = line.getFinalPosition();
      this.args.push(line);
      this.pos++;
    }
  }

  extend.call(Script, mExpression);

  Script.prototype.interpret = function (opts, callback) {

    async.eachSeries(this.args, function (item, incremental) {
      item.interpret(opts, incremental);
    }, function (err) {
      callback(err);
    });
  };

  return Script;
});