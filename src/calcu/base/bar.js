define([
  "../mType/HandleType",
  "./size",
  "./transpose"
], function (HandleType, size, transpose) {

  function bar() {

    var callback = arguments[arguments.length - 1];

    var x = arguments[0];
    var y = arguments[1];

    var data = [];
    var opts = null;
    var line, obj;
    var i, j, k;

    if (size(x)[0][0] == 1) {
      x = transpose(x);
    }

    if (typeof y == "function") {
      y = x;
      x = [];
      for (j = 0; j < y.length; j++) {
        x.push([j + 1]);
      }
    }

    if (size(y)[0][0] == 1) {
      y = transpose(y);
    }

    if (size(x)[0][0] != size(y)[0][0]) {
      y = transpose(y);
    }

    try {
      // if they are vectors
      if (size(x)[0][0] == size(y)[0][0]) {
        if (size(x)[0][1] == 1) {
          for (k = 0; k < y[0].length; k++) {
            line = [];
            for (i = 0; i < x.length; i++) {
              line.push([x[i][0], y[i][k]]);
            }
            obj = {data: line};
            if (y[0].length > 1) {
              obj.label = k.toString();
            }
            var totWidth = obj.data[1][0] - obj.data[0][0];
            obj.bars = {
              show: true,
              barWidth: totWidth * 0.75 / y[0].length,
              lineWidth: 0,
              order: k,
              fill: 0.9
            };
            data.push(obj);
          }
        } else if (size(x)[0][1] > 1) {
          throw "first argument should be a vector when second argument is used.";
        } else {
          throw "vectors are of different lengths";
        }
      } else {
        throw "vectors are of different lengths";
      }

      this.parser.controller.output.createPlot(data, opts, function (err, id) {
        var h = new HandleType(id, "plot", {data: data, opts: opts});
        callback(err, h);
      });
    } catch (ex) {
      return callback("Plot Error :: " + ex);
    }
  }

  bar.async = true;

  bar.shortHelp = "Plots a bar chart from the specified inputs.";
  bar.help = "# bar(X, Y) \n \
Plots the vector or matrix values X vs. Y.\n";


  return bar;

});